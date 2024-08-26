import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import api from '../api';
import '../styles/modalES.css';

const token = localStorage.getItem('token');

Modal.setAppElement('#root');

interface ModalProductoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (
    codigo: string,
    nombre: string,
    descripcion: string,
    ubicacion: number,
    proveedor: string,
    cantidad: number,
    cantidadMinima: number,
    precioUnidadCol: number,
    precioUnidadUSD: number,
    categoria: string
  ) => Promise<void>;
}

const ModalProducto: React.FC<ModalProductoProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState(0);
  const [proveedor, setProveedor] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [cantidadMinima, setCantidadMinima] = useState(0);
  const [precioUnidadCol, setPrecioUnidadCol] = useState(0);
  const [precioUnidadUSD, setPrecioUnidadUSD] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [ubicaciones, setUbicaciones] = useState<{ id: number; nombre: string; descripcion: string }[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUbicaciones();
    }
    if (!isOpen) {
      setCodigo('');
      setNombre('');
      setDescripcion('');
      setUbicacion(ubicaciones.length > 0 ? ubicaciones[0].id : 0);
      setProveedor('');
      setCantidad(0);
      setCantidadMinima(0);
      setPrecioUnidadCol(0);
      setPrecioUnidadUSD(0);
      setCategoria('');
      setError('');
    }
  }, [isOpen]);

  const fetchUbicaciones = async () => {
    try {
      const response = await api.get('/ubicaciones/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUbicaciones(response.data);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (
      codigo.trim() === '' ||
      nombre.trim() === '' ||
      descripcion.trim() === '' ||
      ubicacion === 0 ||
      proveedor.trim() === '' ||
      cantidad === 0 ||
      cantidadMinima === 0 ||
      precioUnidadCol === 0 ||
      precioUnidadUSD === 0 ||
      categoria.trim() === ''
    ) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(
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

      // Limpiar los campos después de la operación exitosa
      setCodigo('');
      setNombre('');
      setDescripcion('');
      setUbicacion(0);
      setProveedor('');
      setCantidad(0);
      setCantidadMinima(0);
      setPrecioUnidadCol(0);
      setPrecioUnidadUSD(0);
      setCategoria('');

      // Cerrar el modal después de la operación exitosa
      onRequestClose();
    } catch (error: any) {
      console.log(error);
      if (error.statusCode === 404) {
        setError(error.message); // Mostrar el mensaje del error recibido
      } else {
        setError('Error al registrar el producto. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Nuevo Producto" className="modal-content">
      <h2>Nuevo Producto</h2>
      {error && <p className="error-message">{error}</p>}
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
          <select value={ubicacion} onChange={(e) => setUbicacion(Number(e.target.value))}>
            {ubicaciones.map((ubica) => (
              <option key={ubica.id} value={ubica.id}>
                {ubica.nombre}
              </option>
            ))}
          </select>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Producto'}
        </button>
      </form>
    </Modal>
  );
};

export default ModalProducto;
