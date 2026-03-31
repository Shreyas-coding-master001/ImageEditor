import axios from 'axios';
import React, { createContext } from 'react'
import { useState, useEffect } from 'react';

export const ImageContextData = createContext();

const ImageContext = (props) => {
    const [imageData, setimageData] = useState([]);
    const [userData, setuserData] = useState(null);

    // Fetch current user on app load
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/auth/me", { withCredentials: true });
          setuserData(response.data.user);
        } catch (err) {
          setuserData(null);
        }
      };
      fetchCurrentUser();
    }, []);

    // Fetch images when user changes
    useEffect(() => {
      async function fetchImages() {
        if (userData) {
          try {
            const Allimages = await axios.get("http://localhost:3000/api/imageEdit/getAllImages", { withCredentials: true });
            setimageData(Allimages.data.Allimages || []);
          } catch (err) {
            console.error("Error fetching images:", err);
            setimageData([]);
          }
        } else {
          setimageData([]);
        }
      }
      fetchImages();
    }, [userData]);

  return (
    <div>
      <ImageContextData.Provider value={{ imageData, setimageData, userData, setuserData }}>
        {props.children}
      </ImageContextData.Provider>
    </div>
  )
}

export default ImageContext;
