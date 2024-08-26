import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';
import axios from 'axios';
import api from '../api';

Modal.setAppElement('#root');

const token = localStorage.getItem('token');

interface ModalModificarUsuarioProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (
    identificacion: string,
    nombre: string,
    email: string,
    rol: string,
    contraseña: string
  ) => Promise<void>;
  identificacion: string;
  nombre: string;
  email: string;
  rol: string;
}

const ModalModificarUsuario: React.FC<ModalModificarUsuarioProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  identificacion,
  nombre,
  email,
  rol
}) => {
  const [formData, setFormData] = useState({
    identificacion,
    nombre,
    email,
    rol,
    contraseña: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        identificacion,
        nombre,
        email,
        rol,
        contraseña: ''
      });
    }
    setError('');
  }, [isOpen, identificacion, nombre, email, rol]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'contraseña' && !/^[a-zA-Z0-9]*$/.test(value)) {
      setError('La contraseña solo puede contener letras y números.');
      return;
    } else {
      setError('');
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const verificarEmailExistente = async (email: string) => {
    try {
      const response = await api.get('/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const usuarios = response.data;
      return usuarios.some((usuario: any) => usuario.email === email && usuario.identificacion !== identificacion);
    } catch (error) {
      console.error('Error al verificar el email', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { identificacion, nombre, email, rol, contraseña } = formData;

    if (!identificacion.trim() || !nombre.trim() || !email.trim() || !rol.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    const emailExistente = await verificarEmailExistente(email);
    if (emailExistente) {
      setError('El correo electrónico ya existe.');
      return;
    }

    await onSubmit(identificacion, nombre, email, rol, contraseña);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modificar Usuario"
      className="modal-content"
    >
      <h2>Modificar Usuario</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Identificación:
          <input
            type="text"
            name="identificacion"
            value={formData.identificacion}
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Rol:
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="">Seleccione un rol</option>
            <option value="Admin">Admin</option>
            <option value="Usuario">Usuario</option>
          </select>
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Dejar en blanco para no cambiar"
          />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </Modal>
  );
};

export default ModalModificarUsuario;
