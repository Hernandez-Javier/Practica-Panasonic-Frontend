import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/modalES.css';

const token = localStorage.getItem('token');

Modal.setAppElement('#root');

interface ModalSalidaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, cantidad: number, destino:string, solicitante:string) => void;
  codigoProducto: string; // prop para el código del producto
  nombreProducto: string; // prop para el nombre del producto
}

const ModalSalida: React.FC<ModalSalidaProps> = ({ isOpen, onRequestClose, onSubmit, codigoProducto, nombreProducto}) => {
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [destino, setDestino] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [nombre, setNombre] = useState('');
  const [departamentos, setDepartamentos] = useState<{ id: string, nombre: string, descripcion: string }[]>([]);
  const [error, setError] = useState('');

  // Actualizar el estado interno cuando cambian los props
  React.useEffect(() => {
    if (isOpen) {
      setCodigo(codigoProducto);
      setNombre(nombreProducto);
    }
  }, [isOpen, codigoProducto, nombreProducto]);

  useEffect(() => {
    if (isOpen) {
      fetchDepartamentos();
    }
  }, [isOpen]);


  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/departamentos/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(codigo, cantidad, destino, solicitante);
    setCodigo('');
    setCantidad(0);
    setDestino('');
    setSolicitante('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Salida de Inventario"  className="modal-content">
      <h2>Salida de Inventario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Código del Producto:
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} readOnly />
        </label>
        <label>
          Nombre del Producto:
          <input type="text" value={nombreProducto} readOnly />
        </label>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
        </label>
        <label>
          Destino:
          <select value={destino} onChange={(e) => setDestino(e.target.value)}>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.nombre}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Solicitante:
          <input type="text" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
        </label>
        <button type="submit">Registrar Salida</button>
      </form>
    </Modal>
  );
};

export default ModalSalida;
