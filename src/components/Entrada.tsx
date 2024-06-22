import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalEntradaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, cantidad: number, orden: string) => Promise<void>;
  codigoProducto: string; // prop para el código del producto
  nombreProducto: string; // prop para el nombre del producto
}

const ModalEntrada: React.FC<ModalEntradaProps> = ({ isOpen, onRequestClose, onSubmit, codigoProducto, nombreProducto }) => {
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [orden, setOrden] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Actualizar el estado interno cuando cambian los props
  useEffect(() => {
    if (isOpen) {
      setCodigo(codigoProducto);
      setNombre(nombreProducto);
    }
    if (!isOpen) {
      setCodigo('');
      setCantidad(0);
      setOrden('');
      setNombre('');
      setError(null);
    }
  }, [isOpen, codigoProducto, nombreProducto]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (!codigo.trim() || cantidad === 0 || !orden.trim() || !nombre.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      await onSubmit(codigo, cantidad, orden);
      setCodigo('');
      setCantidad(0);
      setOrden('');

      onRequestClose();
    } catch (error:any) {
      if (error.message) {
        setError(error.message);
      }
    }
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(e.target.value));
    setError(null); // Limpiar el mensaje de error al cambiar la cantidad
  };

  const handleOrdenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrden(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar el solicitante
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Entrada de Inventario" className="modal-content">
      <h2>Entrada de Inventario</h2>
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
          Orden de compra:
          <input type="text" value={orden} onChange={handleOrdenChange} />
        </label>
        <button type="submit">Registrar Entrada</button>
      </form>
    </Modal>
  );
};

export default ModalEntrada;
