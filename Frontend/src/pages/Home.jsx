import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router";
import "../style/Home.scss";
import {ImageContextData} from "../context/ImageContext.jsx";
import Signup from '../components/auth/Signup.jsx';

const Home = (props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLogin, setisLogin] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const MAX_IMAGES = 3;

  const { imageData, setimageData, userData, setuserData } = useContext(ImageContextData);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setError("No file selected");
      setSelectedFile(null);
    }
  }

  const handleUpload = async () => {
    // Check if context is empty (not logged in)
    if (!userData) {
      setError("Please login first to upload images.");
      setisLogin(false); // As per task
      navigate('/login');
      return;
    }

    if (imageData.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. Delete some to upload new ones.`);
      return;
    }

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    
    // Check if FormData is appending correctly
    if (!formData.has("image")) {
      setError("Failed to append image to FormData.");
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:3000/api/imageEdit/uploadImage", {
        method: "POST",
        body: formData,
        credentials: "include", // For auth cookies
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload success:", data);

      // Update context with new image
      setimageData(prev => [...prev, data.image]);

      // Reset
      setSelectedFile(null);
      setUploading(false);

    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };
 
  const handleImageClick = (image) => {
    navigate("/ImageEditor", { state: { image } });
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/imageEdit/delete/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Update local state - remove from imageData
      setimageData(prev => prev.filter(img => img._id !== imageId));

      console.log('Image deleted');
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  return (
    <div className='mainHome'>
      <div className="top">
        <h2>Welcome To Image Editor</h2>
        <div className="AllButton">
          <label htmlFor="image-choose">
            Choose Image
            <input
              ref={fileInputRef}
              type="file" 
              id='image-choose' 
              name='image'
              accept='image/*' 
              hidden 
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <div className="file-preview">
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="preview-img" />
              <p>{selectedFile.name}</p>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          )}
          <div className="auth-buttons">
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
      <br /><hr />
      
      <div className="bottom">
        {imageData.length > 0 && (
          <section className="images-grid">
            <div className="bottom-top">
              <h3>Your Images </h3>
              <h4>Limit : ({imageData.length}/{MAX_IMAGES})</h4>
            </div>
            <div className="grid">
              {imageData.map((image) => (
                <div key={image._id} className="image-card">
                  <img src={image.url} alt="Uploaded" onClick={() => handleImageClick(image)} />
                  <p>{image.public_id || 'Uploaded Image'}</p>
                  <button className="delete-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image._id);
                  }}>Delete</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

        {error && (
          <div className="error" style={{color: 'red', margin: '10px 0'}}>
            Error: {error}
          </div>
        )}
        {isLogin ? (
          <div>
            <Signup setisLogin={setisLogin} />
          </div>
        ) : null}
    </div>
  )
}

export default Home;
