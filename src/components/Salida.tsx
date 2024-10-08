import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import api from '../api';
import '../styles/modalES.css';

const token = localStorage.getItem('token');

Modal.setAppElement('#root');

interface ModalSalidaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, cantidad: number, destino: string, solicitante: string) => Promise<void>;
  codigoProducto: string; // prop para el código del producto
  nombreProducto: string; // prop para el nombre del producto
}

const ModalSalida: React.FC<ModalSalidaProps> = ({ isOpen, onRequestClose, onSubmit, codigoProducto, nombreProducto }) => {
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [destino, setDestino] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [nombre, setNombre] = useState('');
  const [departamentos, setDepartamentos] = useState<{ id: string, nombre: string, descripcion: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); //Estado para controlar el estado de carga

  // Actualizar el estado interno cuando cambian los props
  useEffect(() => {
    if (isOpen) {
      setCodigo(codigoProducto);
      setNombre(nombreProducto);
      fetchDepartamentos();
    }
    if (!isOpen) {
      setCodigo('');
      setCantidad(0);
      setDestino('');
      setSolicitante('');
      setNombre('');
      setDepartamentos([]);
      setError(null);
      setIsLoading(false); // Reiniciar el estado de carga al cerrar el modal
    }
  }, [isOpen, codigoProducto, nombreProducto]);

  const fetchDepartamentos = async () => {
    try {
      const response = await api.get('/departamentos/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const departamentosData = response.data;
      setDepartamentos(departamentosData);
      if (departamentosData.length > 0) {
        setDestino(departamentosData[0].nombre); // Inicializar con el primer departamento
      }
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(codigo, cantidad, destino, solicitante);

    // Validar que todos los campos estén llenos
    if (!codigo.trim() || cantidad === 0 || !destino.trim() || !solicitante.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setIsLoading(true); // Establecer el estado de carga a true

    try {
      await onSubmit(codigo, cantidad, destino, solicitante);
      setCodigo('');
      setCantidad(0);
      setDestino('');
      setSolicitante('');

      // Cerrar el modal después de la operación exitosa
      onRequestClose();
    } catch (error: any) {
      if (error.message) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false); // Establecer el estado de carga a false al finalizar la operación
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(e.target.value));
    setError(null); // Limpiar el mensaje de error al cambiar la cantidad
  };

  const handleSolicitanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitante(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar el solicitante
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Salida de Inventario" className="modal-content">
      <h2>Salida de Inventario</h2>
      {error && <p className="error-message">{error}</p>}
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
          <input type="number" value={cantidad} onChange={handleCantidadChange} />
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
          <input type="text" value={solicitante} onChange={handleSolicitanteChange} />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Salida'}
        </button>
      </form>
    </Modal>
  );
};

export default ModalSalida;
