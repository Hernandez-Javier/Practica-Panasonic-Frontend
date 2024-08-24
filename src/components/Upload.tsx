import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import '../styles/upload.css';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  proveedor: string;
  cantidad: number;
  cantidadMinima: number;
  precioUnidadCol: number;
  precioUnidadUSD: number;
  categoria: string;
}

interface FileUploadProps {
  onFileUploaded: (productos: Producto[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado para gestionar el estado de carga

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

      const productos: Producto[] = jsonData.slice(1).map((row: any[], index: number) => {
        return {
          id: index + 1,
          codigo: row[1],
          nombre: row[2],
          descripcion: row[3],
          ubicacion: row[5],
          proveedor: row[6],
          cantidad: row[7],
          cantidadMinima: row[8],
          precioUnidadCol: row[9],
          precioUnidadUSD: row[10],
          categoria: row[4]
        };
      });

      setIsLoading(true); // Inicia la carga

      try {
        const response = await axios.post('http://localhost:3000/productos/upload', productos, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        onFileUploaded(productos);
        navigate('/home');
      } catch (error) {
        console.error('Error uploading productos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    reader.readAsBinaryString(file);
  }, [onFileUploaded, navigate, token]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="file-upload-container">
      <h1 className="title">Subir Archivo de Productos</h1>
      <p>**Si se encuentra un código de producto repetido, este será saltado</p>
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno</p>
        </div>
      )}
      <Link to="/home" className="back-button">Regresar</Link>
    </div>
  );
};

export default FileUpload;