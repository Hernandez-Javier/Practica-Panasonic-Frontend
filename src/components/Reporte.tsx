import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import axios from 'axios';
import '../styles/home.css';
import '../styles/report.css';
import PanasonicLogo from '../images/logo-Panasonic.png';

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

interface Entrada {
  id: number;
  codigoproducto: string;
  cantidad: number;
  fecha: string;
  ordencompra: string;
  responsable: string;
}

interface Salida {
  id: number;
  codigoproducto: string;
  cantidad: number;
  fecha: string;
  destino: string;
  solicitante: string;
  responsable: string;
}

interface ReportData {
  codigo: string;
  nombre: string;
  cantidadTotal: number;
  totalColones: number;
  totalDolares: number;
}

const Home: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [showProductos, setShowProductos] = useState(false);//estado para mostrar los productos
  const [entradas, setEntradas] = useState<any[]>([]); //estado para las entradas
  const [showEntradas, setShowEntradas] = useState(false); //estado para mostrar entradas
  const [salidas, setSalidas] = useState<any[]>([]);//estado para las salidas
  const [showSalidas, setShowSalidas] = useState(false);//estado para mostrar las salidas
  const [devoluciones, setDevoluciones] = useState<any[]>([]);//estado para las devoluciones
  const [showDevoluciones, setShowDevoluciones] = useState(false);//estado par mostrar udevoluciones
  const [salidasParticulares, setSalidasParticulares] = useState<any[]>([]);//estado para las devoluciones
  const [showSalidasParticulares, setShowSalidasParticulares] = useState(false);//estado par mostrar ubicaciones
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);//estado para las ubicaciones
  const [showUbicaciones, setShowUbicaciones] = useState(false);//estado par mostrar ubicaciones
  const [departamentos, setDepartamentos] = useState<any[]>([]);//estado para los departamentos
  const [showDepartamentos, setShowDepartamentos] = useState(false);//estado par mostrar departamentos
  const [bitacora, setBitacora] = useState<any[]>([]);//estado para la bitacora
  const [showBitacora, setShowBitacora] = useState(false);//estado para mostrar la bitacora
  const [error, setError] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(''); //guarda la categoria actual para que se muestre al usuario
  // Estados para los filtros de fecha
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');


  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirigir al login si no hay token
    } else {
      fetchProductos();
      fetchDepartamentos();
      setActiveCategory('productos');
    }
  }, [token, navigate]);

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      usuarioNombre = decodedToken.nombre || 'Usuario';
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambios en los filtros de fecha
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };


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
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
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
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
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
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowSalidas(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar devoluciones
  const fetchDevoluciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/devoluciones/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevoluciones(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowDevoluciones(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar salidas particulares
  const fetchSalidasParticulares = async () => {
    try {
      const response = await axios.get('http://localhost:3000/salidas-particulares/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalidasParticulares(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowDevoluciones(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowSalidasParticulares(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar ubicaciones
  const fetchUbicaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ubicaciones/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUbicaciones(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowUbicaciones(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar departamentos
  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/departamentos/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowBitacora(false);
      setShowDepartamentos(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar bitacora
  const fetchBitacora = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bitacora/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBitacora(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar productos en cantidad minima
  const cantidadMinima = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productos/cantidad-minima', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
      setShowSalidas(false);
      setShowEntradas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowProductos(true);
    } catch (error) {
      console.error('Error fetching productos:', error);
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

  //filtros para busquedas
  
  const filteredDevoluciones = devoluciones.filter(devolucion =>
    devolucion.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSalidasParticulares = salidasParticulares.filter(salidaParticular =>
    salidaParticular.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProductos = productos.filter(producto =>
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUbicaciones = ubicaciones.filter(ubicacion =>
    ubicacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBitacora = bitacora.filter(bit =>
    bit.tipoactividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bit.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //*****************************/
  const filteredSalidas = salidas.filter((salida) => {
    const salidaDate = new Date(salida.fecha);
    let startDateObj = null;
    let endDateObj = null;

    // Convertir startDate y endDate a objetos Date si están definidos
    if (startDate) {
        startDateObj = new Date(startDate);
    }
    if (endDate) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        endDateObj = endOfToday;
    }

    // Filtrar por fechas
    const dateFilter = (!startDateObj || salidaDate >= startDateObj) &&
    (!endDateObj || salidaDate <= endDateObj);
  
    // Filtrar por departamento
    const departamentoFilter = !selectedDepartamento || salida.destino === selectedDepartamento;

    return dateFilter && departamentoFilter;
  });

  const filteredEntradas = entradas.filter((entrada) => {
    const entradaDate = new Date(entrada.fecha);
    let startDateObj = null;
    let endDateObj = null;

    // Convertir startDate y endDate a objetos Date si están definidos
    if (startDate) {
        startDateObj = new Date(startDate);
    }
    if (endDate) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        endDateObj = endOfToday;
    }

    // Filtrar por fechas
    const dateFilter = (!startDateObj || entradaDate >= startDateObj) &&
    (!endDateObj || entradaDate <= endDateObj);
  
    // Filtrar por departamento
    //const departamentoFilter = !selectedDepartamento || entrada.destino === selectedDepartamento;

    return dateFilter;
  });

  const handleFilterByDepartamento = (departamento: string) => {
    setSalidas(filteredSalidas.filter((salida) => salida.departamento === departamento));
  };
  
  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartamento(e.target.value);
  };

  const calculateReportSalida = (salidas: Salida[]): ReportData[] => {
    const reportData: { [key: string]: ReportData } = {};

    salidas.forEach((salida) => {
      const producto = productos.find(p => p.codigo === salida.codigoproducto);
      if (!producto) return;

      if (!reportData[salida.codigoproducto]) {
        reportData[salida.codigoproducto] = {
          codigo: salida.codigoproducto,
          nombre: producto.nombre,
          cantidadTotal: 0,
          totalColones: 0,
          totalDolares: 0,
        };
      }
      reportData[salida.codigoproducto].cantidadTotal += salida.cantidad;
      reportData[salida.codigoproducto].totalColones += salida.cantidad * producto.preciounidadcol;
      reportData[salida.codigoproducto].totalDolares += salida.cantidad * producto.preciounidadusd;
    });

    return Object.values(reportData);
  };

  const calculateReportEntrada = (entradas: Entrada[]): ReportData[] => {
    const reportData: { [key: string]: ReportData } = {};

    entradas.forEach((entrada) => {
      const producto = productos.find(p => p.codigo === entrada.codigoproducto);
      if (!producto) return;

      if (!reportData[entrada.codigoproducto]) {
        reportData[entrada.codigoproducto] = {
          codigo: entrada.codigoproducto,
          nombre: producto.nombre,
          cantidadTotal: 0,
          totalColones: 0,
          totalDolares: 0,
        };
      }
      reportData[entrada.codigoproducto].cantidadTotal += entrada.cantidad;
      reportData[entrada.codigoproducto].totalColones += entrada.cantidad * producto.preciounidadcol;
      reportData[entrada.codigoproducto].totalDolares += entrada.cantidad * producto.preciounidadusd;
    });

    return Object.values(reportData);
  };

  const reportSalida = calculateReportSalida(filteredSalidas);

  const reportentrada = calculateReportEntrada(filteredEntradas);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src={PanasonicLogo} alt="Panasonic Logo" className="logo img" />
        </div>
        <div className="user-info">
          <h3 className="user-name">{usuarioNombre}</h3>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        <div className="menu-title">
          <h3>Reportes</h3>
        </div>
        <nav className="main-menu">
          <ul>
            <li><Link to="#" className={activeCategory === 'productos' ? 'active' : ''} onClick={() => {fetchProductos(); setActiveCategory('productos'); }}>Reportes de Productos</Link></li>
            <li><Link to="#" className={activeCategory === 'entradas' ? 'active' : ''} onClick={() => {fetchEntradas(); setActiveCategory('entradas'); }}>Reportes de entradas</Link></li>
            <li><Link to="#" className={activeCategory === 'salidas' ? 'active' : ''} onClick={() => {fetchSalidas(); setActiveCategory('salidas'); }}>Reportes de salidas</Link></li>
            <li><Link to="/home" >Regresar al Menu Principal</Link></li>
          </ul>
        </nav>
      </aside>


      <main className="content">
        <div className="product-list">
        <div className="filters">
          <div>
            <label>Desde: </label>
            <input type="date" value={startDate} onChange={handleStartDateChange} />
            <label>Hasta: </label>
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </div>
          <select value={selectedDepartamento} onChange={(e) => setSelectedDepartamento(e.target.value)}>
            <option value="">Todos los departamentos</option>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.nombre}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </div>
          {showEntradas ? (
            filteredEntradas.length > 0 ? (
              <>
              {reportentrada.length > 0 ? (
                <>
                  <h2>Reporte de Entradas</h2>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Código del Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad Total</th>
                        <th>Total en Colones</th>
                        <th>Total en Dólares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportentrada.map((data) => (
                        <tr key={data.codigo}>
                          <td>{data.codigo}</td>
                          <td>{data.nombre}</td>
                          <td>{data.cantidadTotal}</td>
                          <td>{data.totalColones.toFixed(2)}</td>
                          <td>{data.totalDolares.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>No hay salidas disponibles.</p>
              )}
              <h2>Entradas</h2>
              <div className="product-grid">
                {filteredEntradas.map((entrada) => (
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
                ))}
              </div>
            </>
            ) : (
              <p>No hay entradas disponibles.</p>
            )
          ) : showSalidas ? (
            filteredSalidas.length > 0 ? (
              <>
              {reportSalida.length > 0 ? (
                <>
                  <h2>Reporte de Salidas</h2>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Código del Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad Total</th>
                        <th>Total en Colones</th>
                        <th>Total en Dólares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportSalida.map((data) => (
                        <tr key={data.codigo}>
                          <td>{data.codigo}</td>
                          <td>{data.nombre}</td>
                          <td>{data.cantidadTotal}</td>
                          <td>{data.totalColones.toFixed(2)}</td>
                          <td>{data.totalDolares.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>No hay salidas disponibles.</p>
              )}

                <h2>Salidas</h2>
                <div className="product-grid">
                  {filteredSalidas.map((salida) => (
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
                  ))}
                </div>
              </>
            ) : (
              <p>No hay salidas disponibles.</p>
            )
          ) : showDevoluciones ? (
            filteredDevoluciones.length > 0 ? (
              <div className="product-grid">
                {filteredDevoluciones.map((devolucion) => (
                  <div key={devolucion.id} className="product-item">
                    <div className="product-column">
                      <p><strong>Código:</strong> {devolucion.codigoproducto}</p>
                      <p><strong>Cantidad:</strong> {devolucion.cantidad}</p>
                      <p><strong>Fecha:</strong> {formatDate(devolucion.fecha)}</p>
                    </div>
                    <div className="product-column">
                      <p><strong>Motivo:</strong> {devolucion.motivo}</p>
                      <p><strong>Responsable:</strong> {devolucion.responsable}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay devoluciones disponibles.</p>
            )
          ) : showSalidasParticulares ? (
            filteredSalidasParticulares.length > 0 ? (
              <div className="product-grid">
                {filteredSalidasParticulares.map((salidaParticular) => (
                  <div key={salidaParticular.id} className="product-item">
                    <div className="product-column">
                      <p><strong>Código:</strong> {salidaParticular.codigoproducto}</p>
                      <p><strong>Cantidad:</strong> {salidaParticular.cantidad}</p>
                      <p><strong>Motivo:</strong> {salidaParticular.motivo}</p>
                    </div>
                    <div className="product-column">
                      <p><strong>Responsable:</strong> {salidaParticular.responsable}</p>
                      <p><strong>Fecha:</strong> {formatDate(salidaParticular.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay salidas particulares disponibles.</p>
            )
          ) : (
            filteredProductos.length > 0 ? (
              <>
                <div className="contenedor-botones">
                  <button className="add-product-button" style={{ backgroundColor: '#7a2a20', color: 'white' }} onClick={() => cantidadMinima()}>Inventario Minimo</button>
                </div>
                <div className="product-grid">
                  {filteredProductos.map((producto) => (
                    <div key={producto.id} className="product-item">
                      <div className="product-column">
                        <p><strong>Código:</strong> {producto.codigo}</p>
                        <p><strong>Nombre:</strong> {producto.nombre}</p>
                        <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                        <p><strong>Cantidad Mínima:</strong> {producto.cantidadminima}</p>
                        <p><strong>Descripción:</strong> {producto.descripcion.length > 85 ? `${producto.descripcion.substring(0, 85)}...` : producto.descripcion}</p>
                      </div>
                      <div className="product-column">
                        <p><strong>Ubicación:</strong> {producto.ubicacion}</p>
                        <p><strong>Precio Unidad ₡:</strong> {producto.preciounidadcol}</p>
                        <p><strong>Precio Unidad $:</strong> {producto.preciounidadusd}</p>
                        <p><strong>Total ₡:</strong> {producto.preciototalcol}</p>
                        <p><strong>Total $:</strong> {producto.preciototalusd}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No hay productos disponibles.</p>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;