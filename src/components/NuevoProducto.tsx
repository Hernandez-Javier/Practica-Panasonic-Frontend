import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalProductoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, 
    nombre: string, 
    descripcion: string, 
    ubicacion: string, 
    proveedor: string, 
    cantidad: number, 
    cantidadMinima: number, 
    precioUnidadCol: number, 
    precioUnidadUSD: number, 
    categoria: string) => void;
}

const ModalProducto: React.FC<ModalProductoProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [precioUnidadCol, setPrecioUnidadCol] = useState(0);
  const [precioUnidadUSD, setPrecioUnidadUSD] = useState(0);
  const [categoria, setCategoria] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
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
    );
    setCodigo('');
    setNombre('');
    setDescripcion('');
    setUbicacion('');
    setProveedor('');
    setCantidad(0);
    setCantidadMinima(0);
    setPrecioUnidadCol(0);
    setPrecioUnidadUSD(0);
    setCategoria('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Entrada de Inventario" className="modal-content">
      <h2>Entrada de Inventario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Código del Producto:
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        </label>
        <label>
          Nombre del Producto:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Descripción:
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </label>
        <label>
          Ubicación:
          <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
        </label>
        <label>
          Proveedor:
          <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
        </label>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
        </label>
        <label>
          Cantidad Mínima:
          <input type="number" value={cantidadMinima} onChange={(e) => setCantidadMinima(Number(e.target.value))} />
        </label>
        <label>
          Precio Unidad (COL):
          <input type="number" value={precioUnidadCol} onChange={(e) => setPrecioUnidadCol(Number(e.target.value))} />
        </label>
        <label>
          Precio Unidad (USD):
          <input type="number" value={precioUnidadUSD} onChange={(e) => setPrecioUnidadUSD(Number(e.target.value))} />
        </label>
        <label>
          Categoría:
          <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </label>
        <button type="submit">Registrar Entrada</button>
      </form>
    </Modal>
  );
};

export default ModalProducto;
