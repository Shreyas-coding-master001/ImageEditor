import axios from 'axios';
import React, { createContext } from 'react'
import { useState, useEffect } from 'react';

export const ImageContextData = createContext();

const ImageContext = (props) => {

    const [imageData, setimageData] = useState([]);
    const [userData, setuserData] = useState({});

    useEffect(() => {
      async function fetchImages() {
        if(Object.keys(userData).length !== 0) {
          try{
            const Allimages = await axios.get("http://localhost:3000/api/imageEdit/getAllImages", { withCredentials: true });
            console.log(Allimages.data);
            
            setimageData(Allimages.data.Allimages);
          }catch(err) {
            console.error("Error fetching images:", err);
            alert(`Error : ${err.message}`);
          }
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
