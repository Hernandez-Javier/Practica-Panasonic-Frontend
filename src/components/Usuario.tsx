import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalUsuarioNuevoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (
    identificacion: string,
    nombre: string,
    email: string,
    rol: string,
    contraseña: string
  ) => Promise<void>;
}

const ModalUsuarioNuevo: React.FC<ModalUsuarioNuevoProps> = ({
  isOpen,
  onRequestClose,
  onSubmit
}) => {
  const [identificacion, setIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identificacion.trim() || !nombre.trim() || !email.trim() || !rol.trim() || !contraseña.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    await onSubmit(identificacion, nombre, email, rol, contraseña);
    setIdentificacion('');
    setNombre('');
    setEmail('');
    setRol('');
    setContraseña('');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Agregar Usuario"
      className="modal-content"
    >
      <h2>Agregar Usuario</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          Identificación:
          <input
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            autoComplete="off"
            name="new-identificacion"
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="off"
            name="new-nombre"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            name="new-email"
          />
        </label>
        <label>
          Rol:
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            autoComplete="off"
            name="new-rol"
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            autoComplete="new-password"
            name="new-contraseña"
          />
        </label>
        <button type="submit">Agregar Usuario</button>
      </form>
    </Modal>
  );
};

export default ModalUsuarioNuevo;
