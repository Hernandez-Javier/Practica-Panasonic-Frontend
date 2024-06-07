import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modalES.css';

Modal.setAppElement('#root');

interface ModalEntradaProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (codigo: string, cantidad: number, orden: string) => void;
  codigoProducto: string; // prop para el código del producto
  nombreProducto: string; // prop para el nombre del producto
}

const ModalEntrada: React.FC<ModalEntradaProps> = ({ isOpen, onRequestClose, onSubmit, codigoProducto, nombreProducto }) => {
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [orden, setOrden] = useState('');
  const [nombre, setNombre] = useState('');

  // Actualizar el estado interno cuando cambian los props
  React.useEffect(() => {
    if (isOpen) {
      setCodigo(codigoProducto);
      setNombre(nombreProducto);
    }
  }, [isOpen, codigoProducto, nombreProducto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(codigo, cantidad, orden);
    setCodigo('');
    setCantidad(0);
    setOrden('');
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Entrada de Inventario" className="modal-content">
      <h2>Entrada de Inventario</h2>
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
          Orden de compra:
          <input type="text" value={orden} onChange={(e) => setOrden(e.target.value)} />
        </label>
        <button type="submit">Registrar Entrada</button>
      </form>
    </Modal>
  );
};

export default ModalEntrada;
