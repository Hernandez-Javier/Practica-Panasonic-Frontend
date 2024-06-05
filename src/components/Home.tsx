import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import '../styles/home.css';
import PanasonicLogo from '../images/logo-Panasonic.jpg';

const Home: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [searchType, setSearchType] = useState('code');
  const [searchParam, setSearchParam] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      usuarioNombre = decodedToken.nombre || 'Usuario';
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/productos', {
        params: { type: searchType, param: searchParam },
        headers: { Authorization: `Bearer ${token}` },
      });

      setProductos(response.data);
      setError('');
    } catch (error) {
      console.error('Error buscando productos', error);
      setError('Error interno del servidor');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src={PanasonicLogo} alt="Panasonic Logo" className="logo img" />
        </div>
        <div className="user-info">
          <h3 className="welcome-message">{usuarioNombre}</h3>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <nav className="main-menu">
          <ul>
            <li><Link to="/nuevo-producto">Nuevo producto</Link></li>
            <li><Link to="/entradas-inventario">Entradas de Inventario</Link></li>
            <li><Link to="/salidas-inventario">Salidas de Inventario</Link></li>
            <li><Link to="/departamentos">Departamentos</Link></li>
            <li><Link to="/ubicaciones">Ubicaciones</Link></li>
            <li><Link to="/reportes">Reportes</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <div className="search-container">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="code">Buscar por código</option>
            <option value="name">Buscar por nombre</option>
            <option value="description">Buscar por descripción</option>
          </select>
          <input
            type="text"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder={`Buscar por ${searchType}`}
          />
          <button onClick={handleSearch}>Buscar</button>
        </div>
        <div className="product-list">
          <span>Lista de Productos</span>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div key={producto.id} className="product-item">
                <div className="product-column">
                  <p><strong>Código:</strong> {producto.codigo}</p>
                  <p><strong>Nombre:</strong> {producto.nombre}</p>
                  <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                  <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
                  <p><strong>Descripción:</strong> {producto.descripcion}</p>
                </div>
                <div className="product-column">
                  <p><strong>Proveedor:</strong> {producto.proveedor}</p>
                  <p><strong>Precio Unidad ₡:</strong> {producto.preciounidadcol}</p>
                  <p><strong>Precio Unidad $:</strong> {producto.preciounidadusd}</p>
                  <p><strong>Total ₡:</strong> {producto.preciototalcol}</p>
                  <p><strong>Total $:</strong> {producto.preciototalusd}</p>
                </div>
                <div className="product-column">
                  <div className="product-buttons">
                    <button>Entrada</button>
                    <button>Salida</button>
                    <button>Modificar</button>
                    <button>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;



