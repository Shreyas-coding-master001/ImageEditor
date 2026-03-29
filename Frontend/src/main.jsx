import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router";
import App from './App.jsx';
import ImageContext from './context/ImageContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ImageContext>
        <App />
      </ImageContext>
    </BrowserRouter>
  </StrictMode>,
)
