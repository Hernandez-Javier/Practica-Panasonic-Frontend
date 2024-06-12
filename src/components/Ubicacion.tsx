import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalUbicacionProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: ( 
    nombre: string, 
    descripcion: string) => void;
}

const ModalUbicacion: React.FC<ModalUbicacionProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      nombre,
      descripcion
    );
    setNombre('');
    setDescripcion('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Nueva Ubicacion" className="modal-content">
      <h2>Entrada de Inventario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Descripción:
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>
        <button type="submit">Registrar Entrada</button>
      </form>
    </Modal>
  );
};

export default ModalUbicacion;
