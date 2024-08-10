import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import '../styles/login.css'; // Importa el archivo CSS de estilos

// Importa el logo de Panasonic
import PanasonicLogo from '../images/logo-Panasonic-login.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isResetFormVisible, setIsResetFormVisible] = useState(false);
  const [isResetPassFormVisible, setIsResetPassFormVisible] = useState(false);
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/reset', { email});
      console.log(response);
      toast.success('Se ha enviado un código a tu correo');
    } catch (error) {
      console.error('Error en el envio del código:', error);
      toast.error('Ha ocurrido un error');
    }
  };

  const handleResetPass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/reset', { code, password });
      toast.success('Se ha cambiado tu contraseña');
    } catch (error) {
      console.error('Error en el cambio de contraseña:', error);
      toast.error('Código expirado o erroneo');
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
        <Link className="custom-link" to='#'onClick={() => setIsResetFormVisible(!isResetFormVisible)}>
          {isResetFormVisible ? 'Cancelar' : 'Olvidé mi contraseña'}
        </Link>
      </form>

      <form
        className={`password-reset-form ${isResetFormVisible ? 'visible' : 'hidden'}`}
        onSubmit={handleReset}
      >
        <p>Se enviará un código a tu correo</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Introduce tu correo electrónico"
          required
        />
        <button type="submit">Enviar código</button>
        <Link className="custom-link" to='#' onClick={() => setIsResetPassFormVisible(!isResetPassFormVisible)}>Ya tengo mi código</Link>
      </form>

      <form
        className={`password-reset-form ${isResetPassFormVisible ? 'visible' : 'hidden'}`}
        onSubmit={handleResetPass}
      >
        <label>Código:</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Introduce el código recibido"
          required
        />
        <label>Nueva contraseña:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Introduce la nueva contraseña"
          required
        />
        <button type="submit">Restablecer contraseña</button>
      </form>
    </div>
  );
};

export default Login;

