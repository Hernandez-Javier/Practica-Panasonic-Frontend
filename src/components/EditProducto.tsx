import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalEditarProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (
    codigo: string,
    nombre: string,
    descripcion: string,
    ubicacion: string,
    proveedor: string,
    cantidad: number,
    cantidadMinima: number,
    precioUnidadCol: number,
    precioUnidadUSD: number,
    categoria: string
  ) => void;
  codigo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  proveedor: string;
  cantidad: number;
  cantidadMinima: number;
  precioUnidadCol: number;
  precioUnidadUSD: number;
  categoria: string;
}

const ModalEditar: React.FC<ModalEditarProps> = ({ 
  isOpen, 
  onRequestClose, 
  onSubmit, 
  codigo,
  nombre,
  descripcion,
  ubicacion,
  proveedor,
  cantidad,
  cantidadMinima,
  precioUnidadCol,
  precioUnidadUSD,
  categoria 
}) => {
  const [formData, setFormData] = useState({
    codigo,
    nombre,
    descripcion,
    ubicacion,
    proveedor,
    cantidad,
    cantidadMinima,
    precioUnidadCol,
    precioUnidadUSD,
    categoria,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        codigo,
        nombre,
        descripcion,
        ubicacion,
        proveedor,
        cantidad,
        cantidadMinima,
        precioUnidadCol,
        precioUnidadUSD,
        categoria,
      });
    }
  }, [isOpen, codigo, nombre, descripcion, ubicacion, proveedor, cantidad, cantidadMinima, precioUnidadCol, precioUnidadUSD, categoria]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeT = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(
      formData.codigo,
      formData.nombre,
      formData.descripcion,
      formData.ubicacion,
      formData.proveedor,
      Number(formData.cantidad),
      Number(formData.cantidadMinima),
      Number(formData.precioUnidadCol),
      Number(formData.precioUnidadUSD),
      formData.categoria
    );
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Editar Producto" className="modal-content">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Código del Producto:
          <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} readOnly />
        </label>
        <label>
          Nombre del Producto:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </label>
        <label>
          Descripción:
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChangeT} />
        </label>
        <label>
          Ubicación:
          <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
        </label>
        <label>
          Proveedor:
          <input type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} />
        </label>
        <label>
          Cantidad:
          <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} />
        </label>
        <label>
          Cantidad Mínima:
          <input type="number" name="cantidadMinima" value={formData.cantidadMinima} onChange={handleChange} />
        </label>
        <label>
          Precio Unidad ₡:
          <input type="number" name="precioUnidadCol" value={formData.precioUnidadCol} onChange={handleChange} />
        </label>
        <label>
          Precio Unidad $:
          <input type="number" name="precioUnidadUSD" value={formData.precioUnidadUSD} onChange={handleChange} />
        </label>
        <label>
          Categoría:
          <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} />
        </label>
        <button type="submit">Guardar Cambios</button>
      </form>
    </Modal>
  );
};

export default ModalEditar;

