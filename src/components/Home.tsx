import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import '../styles/home.css'; // Asegúrate de importar los estilos
import PanasonicLogo from '../images/logo-Panasonic.jpg';

const Home: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const navigate = useNavigate();

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Decodificar el token para obtener el nombre del usuario
  let usuarioNombre = 'Usuario';
  if (token) {
    try {
      // Decodificar el token
      const decodedToken: any = jwtDecode(token);
      usuarioNombre = decodedToken.nombre || 'Usuario';
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  useEffect(() => {
    // Obtener la lista de productos
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al usuario a la ruta principal
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-left">
          <img src={PanasonicLogo} alt="Panasonic Logo" className="logo" />
          <span className="user-name"><h3 className="welcome-message">Bienvenido al Sistema de Inventario, {usuarioNombre}</h3></span>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      <nav>
        <ul className="nav-menu">
          <li>
            <Link to="/nuevo-producto">Nuevo producto</Link>
          </li>
          <li>
            <Link to="/movimientos-inventario">Movimientos de Inventario</Link>
          </li>
          <li>
            <Link to="/entradas-inventario">Entrada de Inventario</Link>
          </li>
          <li>
            <Link to="/salidas-inventario">Salida de Inventario</Link>
          </li>
          {/* Agregar más enlaces según las funcionalidades */}
        </ul>
      </nav>
      <div className="product-list">
        <h2>Lista de Productos</h2>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="product-item">
              <p><strong>Código:</strong> {producto.codigo}</p>
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Cantidad:</strong> {producto.cantidad}</p>
              {/* Agregar más detalles del producto si es necesario */}
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
