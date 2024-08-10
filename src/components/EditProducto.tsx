import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalEditarProps {
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
  ) => void;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
  proveedor?: string;
  cantidad?: number;
  cantidadMinima?: number;
  precioUnidadCol?: number;
  precioUnidadUSD?: number;
  categoria?: string;
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
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacionId: 0,
    proveedor: '',
    cantidad: 0,
    cantidadMinima: 0,
    precioUnidadCol: 0,
    precioUnidadUSD: 0,
    categoria: '',
  });

  const [ubicaciones, setUbicaciones] = useState<{ id: number; nombre: string; descripcion: string }[]>([]);
  const [isUbicacionesLoaded, setIsUbicacionesLoaded] = useState(false);

  const token = localStorage.getItem('token');
  let rol = '';

  const fetchUbicaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ubicaciones/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUbicaciones(response.data);
      setIsUbicacionesLoaded(true); // Marcar como cargado
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUbicaciones();
    }
  }, [isOpen]);

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      rol = decodedToken.rol;
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  useEffect(() => {
    if (isOpen && isUbicacionesLoaded) {
      setFormData({
        codigo: codigo || '',
        nombre: nombre || '',
        descripcion: descripcion || '',
        ubicacionId: ubicacion ? ubicaciones.find(ubica => ubica.nombre === ubicacion)?.id || 0 : 0,
        proveedor: proveedor || '',
        cantidad: cantidad || 0,
        cantidadMinima: cantidadMinima || 0,
        precioUnidadCol: precioUnidadCol || 0,
        precioUnidadUSD: precioUnidadUSD || 0,
        categoria: categoria || '',
      });
    }
  }, [isOpen, isUbicacionesLoaded, codigo, nombre, descripcion, ubicacion, proveedor, cantidad, cantidadMinima, precioUnidadCol, precioUnidadUSD, categoria, ubicaciones]);

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

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setFormData({
      ...formData,
      ubicacionId: selectedId,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(
      formData.codigo,
      formData.nombre,
      formData.descripcion,
      formData.ubicacionId,
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
      <h2>Modificar Producto</h2>
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
          <select name="ubicacion" value={formData.ubicacionId} onChange={handleChangeSelect}>
            <option value="" disabled>Seleccione una ubicación</option>
            {ubicaciones.map((ubica) => (
              <option key={ubica.id} value={ubica.id}>
                {ubica.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Proveedor:
          <input type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} />
        </label>
        <label>
          Cantidad:
          <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} disabled={rol !== 'Admin'}/>
        </label>
        <label>
          Cantidad Mínima:
          <input type="number" name="cantidadMinima" value={formData.cantidadMinima} onChange={handleChange} />
        </label>
        <label>
          Precio Unidad ₡:
          <input type="number" name="precioUnidadCol" value={formData.precioUnidadCol} onChange={handleChange} disabled={rol !== 'Admin'}/>
        </label>
        <label>
          Precio Unidad $:
          <input type="number" name="precioUnidadUSD" value={formData.precioUnidadUSD} onChange={handleChange} disabled={rol !== 'Admin'}/>
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
