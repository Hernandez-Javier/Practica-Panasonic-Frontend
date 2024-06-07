/*import React, { useState } from 'react';
import api from '../api';

interface FormData {
    codigo: string;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    proveedor: string;
    cantidad: number; // Definido como número
    cantidadMinima: number; // Definido como número
    precioUnidadCol: number; // Definido como número
    precioUnidadUSD: number; // Definido como número
    categoria: string;
  }

const AddProductoForm = () => {
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    proveedor: '',
    cantidad: 0,
    cantidadMinima: 0,
    precioUnidadCol: 0,
    precioUnidadUSD: 0,
    categoria: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log(formData, token);
      const response = await api.post('/productos', formData, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Producto creado:', response.data);
      // Aquí podrías manejar la respuesta, redirigir al usuario, etc.
    } catch (error) {
      console.error('Error al crear el producto:', error);
      // Aquí podrías manejar el error, mostrar un mensaje al usuario, etc.
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="codigo">Código:</label>
      <input type="text" id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} />
      
      <label htmlFor="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
      
      <label htmlFor="descripcion">Descripción:</label>
      <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} />

      <label htmlFor="ubicacion">Ubicación:</label>
      <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />

      <label htmlFor="proveedor">Proveedor:</label>
      <input type="text" id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} />

      <label htmlFor="cantidad">Cantidad:</label>
      <input type="number" id="cantidad" name="cantidad" value={formData.cantidad} onChange={handleChange} />

      <label htmlFor="cantidadMinima">Cantidad Mínima:</label>
      <input type="number" id="cantidadMinima" name="cantidadMinima" value={formData.cantidadMinima} onChange={handleChange} />

      <label htmlFor="precioUnidadCol">Precio Unidad (COL):</label>
      <input type="number" id="precioUnidadCol" name="precioUnidadCol" value={formData.precioUnidadCol} onChange={handleChange} />

      <label htmlFor="precioUnidadUSD">Precio Unidad (USD):</label>
      <input type="number" id="precioUnidadUSD" name="precioUnidadUSD" value={formData.precioUnidadUSD} onChange={handleChange} />

      <label htmlFor="categoria">Categoría:</label>
      <input type="text" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} />

      <button type="submit">Crear Producto</button>
    </form>
  );
};

export default AddProductoForm;*/


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
