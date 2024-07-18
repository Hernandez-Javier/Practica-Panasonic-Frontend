import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';
import axios from 'axios';

Modal.setAppElement('#root');

interface ModalModificarEntidadProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (id: number, nombre: string, descripcion: string) => Promise<void>;
  id: number;
  nombre: string;
  descripcion: string;
  entidad: string; // Nueva prop para diferenciar entre ubicación y departamento
}

const ModalModificarEntidad: React.FC<ModalModificarEntidadProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  id,
  nombre,
  descripcion,
  entidad,
}) => {
  const [formData, setFormData] = useState({
    id,
    nombre,
    descripcion,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id,
        nombre,
        descripcion,
      });
      setError('');
    } else {
      // Limpiar campos al cerrar el modal
      setFormData({
        id: 0,
        nombre: '',
        descripcion: '',
      });
    }
  }, [isOpen, id, nombre, descripcion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, nombre, descripcion } = formData;

    if (!nombre.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    await onSubmit(id, nombre, descripcion);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={`Modificar ${entidad}`}
      className="modal-content"
    >
      <h2>Modificar {entidad}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
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
          Descripción:
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </Modal>
  );
};

export default ModalModificarEntidad;
