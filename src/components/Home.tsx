import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import axios from 'axios';
import '../styles/home.css';
import PanasonicLogo from '../images/logo-Panasonic.png';
import ModalEntrada from './Entrada';
import ModalSalida from './Salida';
import ModalProducto from './NuevoProducto';

const Home: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [showProductos, setShowProductos] = useState(false);//estado para mostrar los productos
  const [entradas, setEntradas] = useState<any[]>([]); //estado para las entradas
  const [showEntradas, setShowEntradas] = useState(false); //estado para mostrar entradas
  const [salidas, setSalidas] = useState<any[]>([]);//estado para las salidas
  const [showSalidas, setShowSalidas] = useState(false);//estado para mostrar las salidas
  const [searchType, setSearchType] = useState('code');
  const [searchParam, setSearchParam] = useState('');
  const [error, setError] = useState('');
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [isSalidaModalOpen, setIsSalidaModalOpen] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
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
    fetchProductos();
  }, [token]);

  //mostrar productos
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productos/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
      setShowSalidas(false);
      setShowEntradas(false);
      setShowProductos(true);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  //mostrar entradas
  const fetchEntradas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/entradas/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntradas(response.data);
      setShowSalidas(false);
      setShowProductos(false);
      setShowEntradas(true);
    } catch (error) {
      console.error('Error fetching entradas:', error);
    }
  };

  //mostrar salidas
  const fetchSalidas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/salidas/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalidas(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //buscar producto
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

  //eliminar producto
  const handleDelete = async (codigo: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/productos/eliminar/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProductos(productos.filter(producto => producto.codigo !== codigo));
    } catch (error) {
      console.error('Error eliminando el producto', error);
      setError('Error al eliminar el producto');
    }
  };

  //entrada de un producto
  const handleEntrada = async (codigoProducto: string, cantidad: number, ordenCompra: string) => {
    try {
      const response = await axios.post('http://localhost:3000/productos/entrada', {
        codigoProducto,
        cantidad,
        ordenCompra
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Aquí podrías actualizar el estado de productos o realizar alguna otra acción necesaria después de la entrada
    } catch (error) {
      console.error('Error al realizar la entrada:', error);
      // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
    }
  };

  //abrir modal de entrada
  const handleOpenEntradaModal = (codigo: string, nombre: string) => {
    // Abre el modal de entrada y pasa el código y el nombre del producto al modal
    setIsEntradaModalOpen(true);
    setCodigoProducto(codigo);
    setNombreProducto(nombre);
  };

  //abrir modal de salida
  const handleOpenSalidaModal = (codigo: string, nombre: string) => {
    // Abre el modal de entrada y pasa el código y el nombre del producto al modal
    setIsSalidaModalOpen(true);
    setCodigoProducto(codigo);
    setNombreProducto(nombre);
  };

  //salida de un producto
  const handleSalida = async (codigoProducto: string, cantidad: number, destino:string, solicitante:string) => {
    try {
      const response = await axios.post('http://localhost:3000/productos/salida', {
        codigoProducto,
        cantidad,
        destino,
        solicitante
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Aquí podrías actualizar el estado de productos o realizar alguna otra acción necesaria después de la salida
    } catch (error) {
      console.error('Error al realizar la salida:', error);
      // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
    }
  };

  //agregar producto
  const handleProductoNuevo = async (
    codigo: string, 
    nombre:string, 
    descripcion:string, 
    ubicacion:string,
    proveedor:string,
    cantidad: number, 
    cantidadMinima:number,
    precioUnidadCol:number,
    precioUnidadUSD:number,
    categoria:string
    ) => {
    try {
      const response = await axios.post('http://localhost:3000/productos', {
        codigo, 
        nombre, 
        descripcion, 
        ubicacion,
        proveedor,
        cantidad, 
        cantidadMinima,
        precioUnidadCol,
        precioUnidadUSD,
        categoria
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      // Aquí podrías actualizar el estado de productos o realizar alguna otra acción necesaria después de la salida
    } catch (error) {
      console.error('Error al ingresar producto:', error);
      // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
    }
  };

  //formato para las fechas
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
  
    // Formatear la fecha y la hora utilizando date-fns
    return format(date, 'dd/MM/yyyy');
  };

  //logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
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
          <li><Link to="#">Usuarios</Link></li>
            <li><Link to="#" onClick={fetchProductos}>Productos</Link></li>
            <li><Link to="#" onClick={fetchEntradas}>Entradas de Inventario</Link></li>
            <li><Link to="#" onClick={fetchSalidas}>Salidas de Inventario</Link></li>
            <li><Link to="#">Salidas Particulares</Link></li>
            <li><Link to="#">Devoluciones</Link></li>
            <li><Link to="/departamentos">Departamentos</Link></li>
            <li><Link to="/ubicaciones">Ubicaciones</Link></li>
            <li><Link to="/reportes">Reportes</Link></li>
            <li><Link to="#">Bitácoa de Actividad</Link></li>
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
            className="search-bar"
            placeholder={`Buscar por ${searchType}`}
          />
          <button onClick={handleSearch} className="search-container button">Buscar</button>
        </div>
        <div className="product-list">
          <span className="product-list-header">
            {showEntradas ? 'Lista de Entradas' : showSalidas ? 'Lista de Salidas' : 'Lista de Productos'}
          </span>
          {showEntradas ? (
            entradas.length > 0 ? (
              entradas.map((entrada) => (
                <div key={entrada.id} className="product-item">
                  <div className="product-column">
                    <p><strong>Código:</strong> {entrada.codigoproducto}</p>
                    <p><strong>Cantidad:</strong> {entrada.cantidad}</p>
                    <p><strong>Orden de Compra:</strong> {entrada.ordencompra}</p>
                  </div>
                  <div className="product-column">
                    <p><strong>Fecha:</strong> {formatDate(entrada.fecha)}</p>
                    <p><strong>Responsable:</strong> {entrada.responsable}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay entradas disponibles.</p>
            )
          ) : showSalidas ? (
            salidas.length > 0 ? (
              salidas.map((salida) => (
                <div key={salida.id} className="product-item">
                  <div className="product-column">
                    <p><strong>Código:</strong> {salida.codigoproducto}</p>
                    <p><strong>Cantidad:</strong> {salida.cantidad}</p>
                    <p><strong>Destino:</strong> {salida.destino}</p>
                  </div>
                  <div className="product-column">
                    <p><strong>Solicitante:</strong> {salida.solicitante}</p>
                    <p><strong>Fecha:</strong> {formatDate(salida.fecha)}</p>
                    <p><strong>Responsable:</strong> {salida.responsable}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay salidas disponibles.</p>
            )
          ) : (
            productos.length > 0 ? (
              <>
                <button className="add-product-button" onClick={() => setIsProductoModalOpen(true)}> Agregar producto</button>
                {productos.map((producto) => (
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
                        <button onClick={() => handleOpenEntradaModal(producto.codigo, producto.nombre)}>Entrada</button>
                        <button onClick={() => handleOpenSalidaModal(producto.codigo, producto.nombre)}>Salida</button>
                        <button>Modificar</button>
                        <button onClick={() => handleDelete(producto.codigo)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No hay productos disponibles.</p>
            )
          )}
        </div>

      </main>

      <ModalEntrada
        isOpen={isEntradaModalOpen}
        onRequestClose={() => setIsEntradaModalOpen(false)}
        codigoProducto={codigoProducto} // Pasa el código del producto al modal de entrada
        nombreProducto={nombreProducto}
        onSubmit={handleEntrada}
      />
      <ModalSalida
        isOpen={isSalidaModalOpen}
        onRequestClose={() => setIsSalidaModalOpen(false)}
        codigoProducto={codigoProducto} // Pasa el código del producto al modal de entrada
        nombreProducto={nombreProducto}
        onSubmit={handleSalida}
      />
      <ModalProducto
        isOpen={isProductoModalOpen}
        onRequestClose={() => setIsProductoModalOpen(false)}
        onSubmit={handleProductoNuevo}
      />
    </div>
  );
};

export default Home;