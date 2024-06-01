import React, { useState } from 'react';
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

export default AddProductoForm;
