import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalSalidaParticularProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, 
    cantidad: number,
    motivo: string) => void;
}

const ModalSalidaParticular: React.FC<ModalSalidaParticularProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      codigoProducto,
      cantidad,
      motivo
    );
    setCodigoProducto('');
    setCantidad(0);
    setMotivo('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Salida Particular de Inventario" className="modal-content">
      <h2>Salida Particular de Inventario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Código del Producto:
          <input type="text" value={codigoProducto} onChange={(e) => setCodigoProducto(e.target.value)} />
        </label>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
        </label>
        <label>
          Motivo:
          <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </label>
        <button type="submit">Registrar Salida Particular</button>
      </form>
    </Modal>
  );
};

export default ModalSalidaParticular;