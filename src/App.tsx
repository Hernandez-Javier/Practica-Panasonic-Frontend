import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Login from './components/Login';
import Reporte from './components/Reporte';
import Upload from './components/Upload'

const App: React.FC = () => {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reportes" element={<Reporte />} />
          <Route path="/upload" element={<Upload onFileUploaded={(data: any[]) => console.log(data)} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;