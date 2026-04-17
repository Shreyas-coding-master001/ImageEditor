import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ImageContextData } from '../context/ImageContext.jsx';
import "../style/Editor.scss";
import axios from 'axios';
import BASE_URL from '../config/api.js';

// axios.defaults.withCredentials = true;
const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imgRef = useRef(null);
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

  // Generate preview and download URLs

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



  const previewUrl = useMemo(() => {
    if (!selectedImage?.url || !transformation) return selectedImage.url;
    const baseUrl = selectedImage.url.split('/v')[0];
    const versionPart = selectedImage.url.split('/v')[1] || '';
    const transforms = transformation.replace(/,/g, '/') + ',w_800,c_limit,q_auto:good';
    return `${baseUrl}/${transforms}/v${versionPart}`;
  }, [selectedImage?.url, transformation]);

  const downloadUrl = useMemo(() => {
    if (!selectedImage?.url || !transformation) return selectedImage.url;
    const baseUrl = selectedImage.url.split('/v')[0];
    const versionPart = selectedImage.url.split('/v')[1] || '';
    const transforms = transformation.replace(/,/g, '/') + ',w_1200,c_fill,q_auto:good,fl_attachment';
    return `${baseUrl}/${transforms}/v${versionPart}`;
  }, [selectedImage?.url, transformation]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `edited-${selectedImage.public_id || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    try {
      const updatedImage = await axios.patch(`${BASE_URL}/api/imageEdit/images/${selectedImage._id}`, {
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
          <img 
            ref={imgRef}
            src={previewUrl}
            alt="Preview"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '70vh', 
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
            crossOrigin="anonymous"
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
          
          <div className="save-download-buttons">
            <button onClick={handleSave}>💾 Save to Cloud</button>
            <button onClick={handleDownload}>⬇️ Download Edited Image</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Editor;
