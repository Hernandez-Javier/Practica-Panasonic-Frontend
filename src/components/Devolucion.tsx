import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalDevolucionProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigoProducto: string, cantidad: number, motivo: string) => Promise<void>;
}

const ModalDevolucion: React.FC<ModalDevolucionProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCodigoProducto('');
      setCantidad(0);
      setMotivo('');
      setError(null);
    }
  }, [isOpen]);
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!codigoProducto.trim() || cantidad === 0 || !motivo.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    try {
      await onSubmit(codigoProducto, cantidad, motivo);

      setCodigoProducto('');
      setCantidad(0);
      setMotivo('');

      onRequestClose();
    } catch (error) {
      setError('Codigo de poroducto no encontrado');
    }
  };

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigoProducto(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar el código
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(e.target.value));
    setError(null); // Limpiar el mensaje de error al cambiar la cantidad
  };

  const handleMotivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMotivo(e.target.value);
    setError(null); // Limpiar el mensaje de error al cambiar el motivo
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Devolución de Producto" className="modal-content">
      <h2>Devolución de Producto</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Código del Producto:
          <input type="text" value={codigoProducto} onChange={handleCodigoChange} />
        </label>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={handleCantidadChange} />
        </label>
        <label>
          Motivo:
          <input type="text" value={motivo} onChange={handleMotivoChange} />
        </label>
        <button type="submit">Registrar Devolución</button>
      </form>
    </Modal>
  );
};

export default ModalDevolucion;
