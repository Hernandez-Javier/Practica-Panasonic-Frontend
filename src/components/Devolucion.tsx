import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalDevolucionProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigoProducto: string, cantidad: number, motivo: string) => void;
}

const ModalDevolucion: React.FC<ModalDevolucionProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      codigoProducto,
      cantidad,
      motivo,
    );
    setCodigoProducto('');
    setCantidad(0);
    setMotivo('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Devolución de Producto" className="modal-content">
      <h2>Devolución de Producto</h2>
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
        <button type="submit">Registrar Devolución</button>
      </form>
    </Modal>
  );
};

export default ModalDevolucion;
