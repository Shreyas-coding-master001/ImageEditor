import React from 'react'
import { Route, Routes } from "react-router";
import Editor from './pages/Editor';
import Home from "./pages/Home";
import Login from "./components/auth/login";
import Signup from "./components/auth/Signup";
import "./App.scss";

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/ImageEditor" element={<Editor />}/>

      </Routes>
    </main>
  )
}

export default App
