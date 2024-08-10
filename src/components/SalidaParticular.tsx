import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalSalidaParticularProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, 
    cantidad: number,
    motivo: string) => Promise<void>;
}

const ModalSalidaParticular: React.FC<ModalSalidaParticularProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); //Estado para controlar el estado de carga

  useEffect(() => {
    if (!isOpen) {
      setCodigoProducto('');
      setCantidad(0);
      setMotivo('');
      setError(null);
      setIsLoading(false); // Reiniciar el estado de carga al cerrar el modal
    }
  }, [isOpen]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!codigoProducto.trim() || cantidad === 0 || !motivo.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setIsLoading(true); // Establecer el estado de carga a true

    try {
      await onSubmit(
        codigoProducto,
        cantidad,
        motivo
      );
      setCodigoProducto('');
      setCantidad(0);
      setMotivo('');
      onRequestClose();
    } catch (error: any) {
      if(error.message){}
      setError(error.message);
    } finally {
      setIsLoading(false); // Establecer el estado de carga a false al finalizar la operación
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Salida Particular de Inventario" className="modal-content">
      <h2>Salida Particular de Inventario</h2>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Salida Particular'}
        </button>
      </form>
    </Modal>
  );
};

export default ModalSalidaParticular;