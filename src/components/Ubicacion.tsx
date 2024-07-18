import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalUbicacionProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: ( 
    nombre: string, 
    descripcion: string) => Promise<void>;
}

const ModalUbicacion: React.FC<ModalUbicacionProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNombre('');
      setDescripcion('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (!nombre.trim() || !descripcion.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      await onSubmit(nombre, descripcion);
      setNombre('');
      setDescripcion('');
      onRequestClose();
    } catch (error) {
      console.error('Error al registrar la ubicación:', error);
      setError('Ocurrió un error al registrar la ubicación. Inténtelo de nuevo.');
    }
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar el solicitante
  };

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescripcion(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar la descripción
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Nueva Ubicacion" className="modal-content">
      <h2>Nueva Ubicacion</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={handleNombreChange} />
        </label>
        <label>
          Descripción:
          <textarea value={descripcion} onChange={handleDescripcionChange} />
        </label>
        <button type="submit">Agregar</button>
      </form>
    </Modal>
  );
};

export default ModalUbicacion;
