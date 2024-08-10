import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';

interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    proveedor: string;
    cantidad: number;
    cantidadminima: number;
    preciounidadcol: number;
    preciounidadusd: number;
    categoria: string;
}

interface ExportToExcelProps {
    productos: Producto[];
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ productos }) => {
  
  const exportExcel = () => {
    // Crea una hoja de trabajo a partir de los datos de productos
    const worksheet = XLSX.utils.json_to_sheet(productos.map(producto => ({
        'id': producto.id,
        'Código': producto.codigo,
        'Nombre': producto.nombre,
        'Descripción': producto.descripcion,
        'Categoría': producto.categoria,
        'Ubicación': producto.ubicacion,
        'proveedor':producto.proveedor,
        'Cantidad': producto.cantidad,
        'Cantidad Minima': producto.cantidadminima,
        'Precio por Unidad (Colones)': producto.preciounidadcol,
        'Precio por Unidad (USD)': producto.preciounidadusd,
    })));

    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Genera un archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guarda el archivo Excel usando file-saver
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'productos.xlsx');
  };

  return (
    <Link to="#" onClick={exportExcel}>Exportar Datos</Link>
  );
};

export default ExportToExcel;
