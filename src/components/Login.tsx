import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/login.css'; // Importa el archivo CSS de estilos

// Importa el logo de Panasonic
import PanasonicLogo from '../images/logo-Panasonic.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      {/* Logo de Panasonic */}
      <img src={PanasonicLogo} alt="Panasonic Logo" className="panasonic-logo" />

      {/* Formulario de inicio de sesión */}
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label>Correo:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

