import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
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
  const [salidasParticulares, setSalidasParticulares] = useState<any[]>([]);//estado para las devoluciones
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);//estado para las ubicaciones
  const [departamentos, setDepartamentos] = useState<any[]>([]);//estado para los departamentos
  const [bitacora, setBitacora] = useState<any[]>([]);//estado para la bitacora
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(''); //guarda la categoria actual para que se muestre al usuario
  // Estados para los filtros de fecha
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalCRC, setTotalCRC] = useState(0);
  const [reportEntrada, setReportEntrada] = useState<ReportData[]>([]);
  const [totalUSDS, setTotalUSDS] = useState(0);
  const [totalCRCS, setTotalCRCS] = useState(0);
  const [reportSalida, setReportSalida] = useState<ReportData[]>([]);
  //grafico
  const [topDepartamentosData, setTopDepartamentosData] = useState<{ departamentos: string[], cantidades: number[] }>({ departamentos: [], cantidades: [] });


  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';

  useEffect(() => {
      fetchProductos();
      fetchDepartamentos();
      setActiveCategory('productos');
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/')
    }; // Redirigir al login si no hay token
  }, [token]);

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      usuarioNombre = decodedToken.nombre || 'Usuario';
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

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

  //mostrar ubicaciones
  const fetchUbicaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ubicaciones/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUbicaciones(response.data);
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

  const filteredProductos = productos.filter(producto =>
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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

  const filteredEntradas =  entradas.filter((entrada) => {
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

  useEffect(() => {
    const { reportData:reportSalida, totalColonesGlobal2, totalDolaresGlobal2 } = calculateReportSalida(filteredSalidas);
    setReportSalida(reportSalida);
    setTotalCRCS(totalColonesGlobal2);
    setTotalUSDS(totalDolaresGlobal2);

    const { reportData:reportEntrada, totalColonesGlobal, totalDolaresGlobal } = calculateReportEntrada(filteredEntradas);
    setReportEntrada(reportEntrada);
    setTotalCRC(totalColonesGlobal);
    setTotalUSD(totalDolaresGlobal);

    //const topDepartamentos = calculateTopDepartamentos(filteredSalidas);
    //setTopDepartamentosData(topDepartamentos);
  }, [filteredEntradas, filteredSalidas]);

  const calculateReportSalida = (salidas: Salida[]): { reportData: ReportData[], totalColonesGlobal2: number, totalDolaresGlobal2: number } => {
    const reportData: { [key: string]: ReportData } = {};
    let totalColonesGlobal2 = 0;
    let totalDolaresGlobal2 = 0;

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

        totalColonesGlobal2 += salida.cantidad * producto.preciounidadcol;
        totalDolaresGlobal2 += salida.cantidad * producto.preciounidadusd;
    });

    return {
        reportData: Object.values(reportData),
        totalColonesGlobal2,
        totalDolaresGlobal2
    };
  };

  const calculateReportEntrada = (entradas: Entrada[]): {reportData: ReportData[], totalColonesGlobal: number, totalDolaresGlobal: number } => {
    const reportData: { [key: string]: ReportData } = {};
    let totalColonesGlobal = 0;
    let totalDolaresGlobal = 0;

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

      totalColonesGlobal += entrada.cantidad * producto.preciounidadcol;
      totalDolaresGlobal += entrada.cantidad * producto.preciounidadusd;
    });
    return {
      reportData: Object.values(reportData),
      totalColonesGlobal,
      totalDolaresGlobal
    };
  };


  //calcula los departamentos para el grafico
  const calculateTopDepartamentos = (salidas: Salida[]): { departamentos: string[], cantidades: number[] } => {
    const departamentoCount: { [key: string]: number } = {};
  
    salidas.forEach((salida) => {
      if (!departamentoCount[salida.destino]) {
        departamentoCount[salida.destino] = 0;
      }
      departamentoCount[salida.destino] += salida.cantidad;
    });
  
    const sortedDepartamentos = Object.entries(departamentoCount).sort((a, b) => b[1] - a[1]);
    const topDepartamentos = sortedDepartamentos.slice(0, 5);
  
    return {
      departamentos: topDepartamentos.map(item => item[0]),
      cantidades: topDepartamentos.map(item => item[1])
    };
  };
  

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
              {reportEntrada.length > 0 ? (
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
                      {reportEntrada.map((data) => (
                        <tr key={data.codigo}>
                          <td>{data.codigo}</td>
                          <td>{data.nombre}</td>
                          <td>{data.cantidadTotal}</td>
                          <td>{data.totalColones.toFixed(2)}</td>
                          <td>{data.totalDolares.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCRC.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalUSD.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <p>No hay entradas disponibles.</p>
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
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCRCS.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalUSDS.toFixed(2)}</td>
                      </tr>
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