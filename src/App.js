import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import InputPage from './pages/InputPage/InputPage';
import DisplayPage from './pages/DisplayPage/DisplayPage';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: 20 }}>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/">Input</Link>{" | "}
        <Link to="/display">Display</Link>
      </nav>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </div>
  );
}

export default App;
