import React, { useEffect, useState } from 'react';
import api from '../api';

interface Movimiento {
  id: number;
  codigoproducto: string;
  cantidad: number;
  fecha: string;
  ordencompra?: string;
  destino?: string;
  solicitante?: string;
  responsable: string;
}

const MovimientosInventario: React.FC = () => {
  const [entradas, setEntradas] = useState<Movimiento[]>([]);
  const [salidas, setSalidas] = useState<Movimiento[]>([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await api.get('/inventario/movimientos');
        setEntradas(response.data.entradas);
        setSalidas(response.data.salidas);
      } catch (error) {
        console.error('Error fetching inventory movements:', error);
      }
    };

    fetchMovimientos();
  }, []);

  return (
    <div>
      <h2>Entradas de Inventario</h2>
      <table>
        <thead>
          <tr>
            <th>CodigoProducto</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>OrdenCompra</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((entrada) => (
            <tr key={entrada.id}>
              <td>{entrada.codigoproducto}</td>
              <td>{entrada.cantidad}</td>
              <td>{entrada.fecha}</td>
              <td>{entrada.ordencompra}</td>
              <td>{entrada.responsable}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Salidas de Inventario</h2>
      <table>
        <thead>
          <tr>
            <th>CodigoProducto</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Destino</th>
            <th>Solicitante</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          {salidas.map((salida) => (
            <tr key={salida.id}>
              <td>{salida.codigoproducto}</td>
              <td>{salida.cantidad}</td>
              <td>{salida.fecha}</td>
              <td>{salida.destino}</td>
              <td>{salida.solicitante}</td>
              <td>{salida.responsable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovimientosInventario;
