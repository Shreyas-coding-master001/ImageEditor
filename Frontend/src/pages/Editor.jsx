import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ImageContextData } from '../context/ImageContext.jsx';
import "../style/Editor.scss";

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageData, setimageData } = useContext(ImageContextData);
  const selectedImage = location.state?.image;

  useEffect(() => {
    if (!selectedImage) {
      navigate('/');
    }
  }, [selectedImage, navigate]);

  if (!selectedImage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editor">
      <h2>Edit Image</h2>
      <img 
        src={selectedImage.url} 
        alt="Editing" 
        style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
      />
      {/* Add editing tools here */}
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default Editor;
