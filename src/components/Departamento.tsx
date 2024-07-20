import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalDepartamentoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: ( 
    nombre: string, 
    descripcion: string) => Promise<void>;
}

const ModalDepartamento: React.FC<ModalDepartamentoProps> = ({ isOpen, onRequestClose, onSubmit }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      console.error('Error al registrar el departamento:', error);
      setError('Ocurrió un error al registrar el departamento. Inténtelo de nuevo.');
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Nuevo Departamento" className="modal-content">
      <h2>Nuevo Departamento</h2>
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
        <button type="submit">Registrar Departamento</button>
      </form>
    </Modal>
  );
};

export default ModalDepartamento;
