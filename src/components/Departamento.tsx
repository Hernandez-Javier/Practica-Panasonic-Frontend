import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalDepartamentoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: ( 
    nombre: string, 
    descripcion: string) => void;
}

const ModalDepartamento: React.FC<ModalDepartamentoProps> = ({ isOpen, onRequestClose, onSubmit }) => {
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Nuevo Departamento" className="modal-content">
      <h2>Nuevo Departamento</h2>
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

export default ModalDepartamento;
