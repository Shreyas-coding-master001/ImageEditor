import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ImageContextData } from '../context/ImageContext.jsx';
import "../style/Editor.scss";
import axios from 'axios';

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { imageData, setimageData } = useContext(ImageContextData);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [transformation, setTransformation] = useState('');
  const selectedImage = location.state?.image;

  useEffect(() => {
    if (!selectedImage) {
      navigate('/');
    }
  }, [selectedImage, navigate]);

  // Live canvas preview update
  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    let previewSrc = selectedImage.url;
    if (selectedImage.transformation) {
      const base = selectedImage.url.split('/v')[0] + '/';
      const versionRest = selectedImage.url.split('/v')[1];
      const transforms = selectedImage.transformation.replace(/,/g, '/') + ',w_600,c_limit/';
      previewSrc = base + transforms + 'v' + versionRest;
    }
    img.src = previewSrc;
  }, [selectedImage]);

  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

// Parse saved transformation to initialize sliders
  useEffect(() => {
    if (selectedImage?.transformation) {
      const matches = selectedImage.transformation.match(/e_([a-z_]+):?(-?\\d+)?/g) || [];
      const effects = {};
      matches.forEach(effect => {
        const nameMatch = effect.match(/e_([a-z_]+)/);
        const valMatch = effect.match(/:(-?\\d+)/);
        if (nameMatch) {
          const name = nameMatch[1];
          const value = valMatch ? parseInt(valMatch[1]) : 100;
          effects[name] = value;
        }
      });
      setBrightness(effects.brightness || 0);
      setContrast(effects.contrast || 0);
      setSaturation(effects.saturation || 0);
      setGrayscale(effects.grayscale ? 100 : 0);
      setSepia(effects.sepia ? 100 : 0);
    }
  }, [selectedImage]);

  // Update transformation string for Cloudinary
  useEffect(() => {
    const t = [];
    if (brightness !== 0) t.push(`e_brightness:${brightness}`);
    if (contrast !== 0) t.push(`e_contrast:${contrast}`);
    if (saturation !== 0) t.push(`e_saturation:${saturation}`);
    if (grayscale > 0) t.push(`e_grayscale`);
    if (sepia > 0) t.push(`e_sepia`);
    setTransformation(t.join(','));
  }, [brightness, contrast, saturation, grayscale, sepia]);

  // Live CSS filters on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let filter = '';
    if (brightness) filter += `brightness(${1 + brightness / 100}) `;
    if (contrast) filter += `contrast(${1 + contrast / 100}) `;
    if (saturation) filter += `saturate(${1 + saturation / 100}) `;
    if (grayscale > 0) filter += `grayscale(${grayscale / 100}) `;
    if (sepia > 0) filter += `sepia(${sepia / 100}) `;
    canvas.style.filter = filter.trim() || 'none';
  }, [brightness, contrast, saturation, grayscale, sepia]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSave = async () => {
    try {
      const updatedImage = await axios.patch(`http://localhost:3000/api/imageEdit/images/${selectedImage._id}`, {
        transformation
      }, { withCredentials: true });
      
      // Update context
      setimageData(prev => prev.map(img => img._id === selectedImage._id ? updatedImage.data.image : img));
      
      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save.");
    }
  };

  if (!selectedImage) return <div>Loading...</div>;

  return (
    <div className="editor">
      <section className="top">
        <h2>Edit Image</h2>
        <div className="buttons">
          <button onClick={() => navigate('/')}>Back</button>
          <button onClick={handleDownload}>Download</button>
        </div>
      </section>
      <section className="ImageEditing">
        <div className="left">
          <canvas 
            ref={canvasRef} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '70vh', 
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }} 
          />
        </div>
        <div className="right">
          <h3>Filters</h3>
          <div className="filters">
            <div className="filter">
              <h4>Brightness</h4>
              <input type="range" min="-100" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
            </div>
            <div className="filter">
              <h4>Contrast</h4>
              <input type="range" min="-100" max="100" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
            </div>
            <div className="filter">
              <h4>Saturation</h4>
              <input type="range" min="-100" max="100" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} />
            </div>
            <div className="filter">
              <h4>Grayscale</h4>
              <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} />
            </div>
            <div className="filter">
              <h4>Sepia</h4>
              <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(Number(e.target.value))} />
            </div>
          </div>
          <button onClick={handleSave}>Save to Cloud</button>
        </div>
      </section>
    </div>
  );
};

export default Editor;
