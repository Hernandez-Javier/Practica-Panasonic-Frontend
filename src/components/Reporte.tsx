import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/home.css';
import '../styles/report.css';
import PanasonicLogo from '../images/logo-Panasonic.png';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

interface ReportDataProducto {
  ubicacion: string;
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
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);//estado para las ubicaciones
  const [departamentos, setDepartamentos] = useState<any[]>([]);//estado para los departamentos
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(''); //guarda la categoria actual para que se muestre al usuario
  // Estados para los filtros de fecha y datos de las tablas
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [selectedUbicacion, setSelectedUbicacion] = useState<string>('');
  const [totalCantidadE, settotalCantidadE] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalCRC, setTotalCRC] = useState(0);
  const [reportEntrada, setReportEntrada] = useState<ReportData[]>([]);
  const [totalCantidadS, settotalCantidadS] = useState(0);
  const [totalUSDS, setTotalUSDS] = useState(0);
  const [totalCRCS, setTotalCRCS] = useState(0);
  const [reportSalida, setReportSalida] = useState<ReportData[]>([]);
  const [totalUSDP, settotalUSDP] = useState(0);
  const [totalCRCP, settotalCRCP] = useState(0);
  const [totalUSDP2, settotalUSDP2] = useState(0);
  const [totalCRCP2, settotalCRCP2] = useState(0);
  const [totalCantidad, settotalCantidad] = useState(0);
  const [totalCantidadP, settotalCantidadP] = useState(0);
  const [reportProducto, setReportProducto] = useState<ReportDataProducto[]>([]);
  const [reportProducto2, setReportProducto2] = useState<ReportData[]>([]);
  //grafico
  const [showChartSalidas, setShowChartSalidas] = useState(false);
  const [showChartEntradas, setShowChartEntradas] = useState(false);
  const [showChartProductos, setShowChartProductos] = useState(false);


  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';

  useEffect(() => {
      fetchProductos();
      fetchDepartamentos();
      fetchUbicaciones();
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
      setError('Error fetching productos. Please try again later.');
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

  /*************** filtros par mostrar reportes **************/
  const filteredProductos = productos.filter((producto) => {
    const ubicacionFilter = !selectedUbicacion || producto.ubicacion === selectedUbicacion;

    return ubicacionFilter;
  });

  const filteredSalidas = salidas.filter((salida) => {
    const salidaDate = new Date(salida.fecha);
    let startDateObj = startDate ? new Date(startDate) : null;
    let endDateObj = endDate ? new Date(endDate) : null;
  
    const dateFilter = (!startDateObj || salidaDate >= startDateObj) &&
      (!endDateObj || salidaDate <= endDateObj);
  
    const departamentoFilter = !selectedDepartamento || salida.destino === selectedDepartamento;

    return dateFilter && departamentoFilter;
  });
  
  const filteredEntradas = entradas.filter((entrada) => {
    const entradaDate = new Date(entrada.fecha);
    let startDateObj = startDate ? new Date(startDate) : null;
    let endDateObj = endDate ? new Date(endDate) : null;
  
    const dateFilter = (!startDateObj || entradaDate >= startDateObj) &&
      (!endDateObj || entradaDate <= endDateObj);
  
    return dateFilter;
  });

  const filteredSalidasGraph = salidas.filter((salida) => {
    const salidaDate = new Date(salida.fecha);
    let startDateObj = startDate ? new Date(startDate) : null;
    let endDateObj = endDate ? new Date(endDate) : null;
  
    const dateFilter = (!startDateObj || salidaDate >= startDateObj) &&
      (!endDateObj || salidaDate <= endDateObj);
  
    return dateFilter;
  });

  //reporte de lista de productos de una ubicacion
  const calculateReportByLocation = (
    productos: Producto[],
    selectedUbicacion: string
  ): {
    reportData: ReportData[],
    totalGlobalColones2: number,
    totalGlobalDolares2: number,
    totalGlobalCantidadProducto: number
  } => {
    const filteredProductos = productos.filter(
      (producto) => producto.ubicacion === selectedUbicacion
    );
  
    let totalGlobalColones2 = 0;
    let totalGlobalDolares2 = 0;
    let totalGlobalCantidadProducto = 0;
  
    const reportData = filteredProductos.map((producto) => {
      const totalColones = producto.cantidad * producto.preciounidadcol;
      const totalDolares = producto.cantidad * producto.preciounidadusd;
  
      totalGlobalColones2 += totalColones;
      totalGlobalDolares2 += totalDolares;
      totalGlobalCantidadProducto += producto.cantidad;
  
      return {
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidadTotal: producto.cantidad,
        totalColones,
        totalDolares,
      };
    });
  
    return {
      reportData,
      totalGlobalColones2,
      totalGlobalDolares2,
      totalGlobalCantidadProducto,
    };
  };  

  //reporte de total de cantidad de productos agrupados por ubicacion
  const calculateReportProducto = (productos: Producto[]): { 
    reportData: ReportDataProducto[], 
    totalGlobalColones: number, 
    totalGlobalDolares: number, 
    totalGlobalCantidad: number 
  } => {
    const ubicacionesMap: { [key: string]: ReportDataProducto } = {};
    let totalGlobalColones = 0;
    let totalGlobalDolares = 0;
    let totalGlobalCantidad = 0;
  
    productos.forEach((producto) => {
      if (!ubicacionesMap[producto.ubicacion]) {
        ubicacionesMap[producto.ubicacion] = {
          ubicacion: producto.ubicacion,
          cantidadTotal: 0,
          totalColones: 0,
          totalDolares: 0,
        };
      }
  
      ubicacionesMap[producto.ubicacion].cantidadTotal += producto.cantidad;
      ubicacionesMap[producto.ubicacion].totalColones += producto.cantidad * producto.preciounidadcol;
      ubicacionesMap[producto.ubicacion].totalDolares += producto.cantidad * producto.preciounidadusd;
  
      totalGlobalColones += producto.cantidad * producto.preciounidadcol;
      totalGlobalDolares += producto.cantidad * producto.preciounidadusd;
      totalGlobalCantidad += producto.cantidad;
    });
  
    return {
      reportData: Object.values(ubicacionesMap),
      totalGlobalColones,
      totalGlobalDolares,
      totalGlobalCantidad
    };
  };
  

  const calculateReportSalida = (salidas: Salida[]): { 
    reportData: ReportData[], 
    totalColonesGlobal2: number, 
    totalDolaresGlobal2: number,
    totalGlobalCantidadSalida: number 
  } => {
    const reportData: { [key: string]: ReportData } = {};
    let totalColonesGlobal2 = 0;
    let totalDolaresGlobal2 = 0;
    let totalGlobalCantidadSalida = 0;
  
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
      totalGlobalCantidadSalida += salida.cantidad;
    });
  
    return {
      reportData: Object.values(reportData),
      totalColonesGlobal2,
      totalDolaresGlobal2,
      totalGlobalCantidadSalida
    };
  };
  
  const calculateReportEntrada = (entradas: Entrada[]): { 
    reportData: ReportData[], 
    totalColonesGlobal: number, 
    totalDolaresGlobal: number,
    totalGlobalCantidadEntrada: number 
  } => {
    const reportData: { [key: string]: ReportData } = {};
    let totalColonesGlobal = 0;
    let totalDolaresGlobal = 0;
    let totalGlobalCantidadEntrada = 0;
  
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
      totalGlobalCantidadEntrada += entrada.cantidad;
    });
  
    return {
      reportData: Object.values(reportData),
      totalColonesGlobal,
      totalDolaresGlobal,
      totalGlobalCantidadEntrada
    };
  };
  

  const handleGenerateReport = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedDepartamento(selectedDepartamento);
    setSelectedUbicacion(selectedUbicacion);
  
    // Reporte de salidas
    const { reportData: reportSalida, totalColonesGlobal2, totalDolaresGlobal2, totalGlobalCantidadSalida } = calculateReportSalida(filteredSalidas);
    setReportSalida(reportSalida);
    setTotalCRCS(totalColonesGlobal2);
    setTotalUSDS(totalDolaresGlobal2);
    settotalCantidadS(totalGlobalCantidadSalida);
  
    // Reporte de entradas
    const { reportData: reportEntrada, totalColonesGlobal, totalDolaresGlobal, totalGlobalCantidadEntrada } = calculateReportEntrada(filteredEntradas);
    setReportEntrada(reportEntrada);
    setTotalCRC(totalColonesGlobal);
    setTotalUSD(totalDolaresGlobal);
    settotalCantidadE(totalGlobalCantidadEntrada);
  
    // Reporte de productos por ubicación
    const { reportData: reportProductos, totalGlobalColones, totalGlobalDolares, totalGlobalCantidad } = calculateReportProducto(productos);
    setReportProducto(reportProductos);
    settotalCRCP(totalGlobalColones);
    settotalUSDP(totalGlobalDolares);
    settotalCantidad(totalGlobalCantidad);

    // Reporte de productos por ubicación
    const { reportData: reportProductos2, totalGlobalColones2, totalGlobalDolares2, totalGlobalCantidadProducto } = calculateReportByLocation(filteredProductos, selectedUbicacion);
    setReportProducto2(reportProductos2);
    settotalCRCP2(totalGlobalColones2);
    settotalUSDP2(totalGlobalDolares2);
    settotalCantidadP(totalGlobalCantidadProducto);
  };
  
  //calcula las ubicaciones top en productos para el grafico
  const calculateTopUbicaciones = (productos: Producto[]): { topUbicaciones: string[], cantidadesU: number[] } => {
    const ubicacionCount: { [key: string]: number } = {};
    
    productos.forEach((producto) => {
      if (!ubicacionCount[producto.ubicacion]) {
        ubicacionCount[producto.ubicacion] = 0;
      }
      ubicacionCount[producto.ubicacion] += producto.cantidad;
    });
    
    const sortedUbicaciones = Object.entries(ubicacionCount).sort((a, b) => b[1] - a[1]);
    const topUbicaciones = sortedUbicaciones.slice(0, 8);
    console.log(topUbicaciones);
    return {
      topUbicaciones: topUbicaciones.map(item => item[0]),
      cantidadesU: topUbicaciones.map(item => item[1])
    };
  };
  
  //calcula los productos top en entradas para el grafico
  const calculateTopProductos = (entradas: Entrada[]): { topProductos: string[], cantidadesP: number[] } => {
    const productoCount: { [key: string]: number } = {};
    
    entradas.forEach((entrada) => {
      if (!productoCount[entrada.codigoproducto]) {
        productoCount[entrada.codigoproducto] = 0;
      }
      productoCount[entrada.codigoproducto] += entrada.cantidad;
    });
    
    const sortedProductos = Object.entries(productoCount).sort((a, b) => b[1] - a[1]);
    const topProductos = sortedProductos.slice(0, 5);
    return {
      topProductos: topProductos.map(item => item[0]),
      cantidadesP: topProductos.map(item => item[1])
    };
  };

  //calcula los departamentos top en salidas para el grafico
  const calculateTopDepartamentos = (salidas: Salida[]): { topDepartamentos: string[], cantidadesD: number[] } => {
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
      topDepartamentos: topDepartamentos.map(item => item[0]),
      cantidadesD: topDepartamentos.map(item => item[1])
    };
  };

  const { topDepartamentos, cantidadesD } = useMemo(() => calculateTopDepartamentos(filteredSalidasGraph), [filteredSalidasGraph]);
  const { topProductos, cantidadesP } = useMemo(() => calculateTopProductos(filteredEntradas), [filteredEntradas]);
  const { topUbicaciones, cantidadesU } = useMemo(() => calculateTopUbicaciones(productos), [productos]);

  const dataProductosChart = {
    labels: topUbicaciones,
    datasets: [
      {
        label: 'Cantidad de Productos',
        data: cantidadesU,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dataSalidasChart = {
    labels: topDepartamentos,
    datasets: [
      {
        label: 'Cantidad de Salidas',
        data: cantidadesD,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dataEntradasChart = {
    labels: topProductos,
    datasets: [
      {
        label: 'Cantidad de Entradas',
        data: cantidadesP,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const options = (title:any) => ({
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  });

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
        <div>
          <div className="filters">
            {(activeCategory === 'salidas' || activeCategory === 'entradas') && (
              <div>
                <label>Desde: </label>
                <input type="date" value={startDate} onChange={handleStartDateChange} />
                <label>Hasta: </label>
                <input type="date" value={endDate} onChange={handleEndDateChange} />
              </div>
            )}
            {activeCategory === 'salidas' && (
              <select className="search-bar" value={selectedDepartamento} onChange={(e) => setSelectedDepartamento(e.target.value)}>
                <option value="">Todos los departamentos</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.nombre}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            )}
            {activeCategory === 'productos' && (
              <>
              <label>Selecciona una ubicacion para filtrar los productos</label>
              <select className="search-bar" value={selectedUbicacion} onChange={(e) => setSelectedUbicacion(e.target.value)}>
                <option value="">Todos las ubicaciones</option>
                {ubicaciones.map((ubi) => (
                  <option key={ubi.id} value={ubi.nombre}>
                    {ubi.nombre}
                  </option>
                ))}
              </select>
              </>
            )}
            <div className="contenedor-botones">
              <button className="add-product-button" onClick={handleGenerateReport}>Generar Reporte</button>
              {activeCategory === 'salidas' && (
                <button className="add-product-button" onClick={()=>setShowChartSalidas(!showChartSalidas)}>Grafico Salidas por Departamentos</button>
              )}
              {activeCategory === 'entradas' && (
                <button className="add-product-button" onClick={()=>setShowChartEntradas(!showChartEntradas)}>Grafico Entradas por Productos</button>
              )}
              {activeCategory === 'productos' && (
                <button className="add-product-button" onClick={()=>setShowChartProductos(!showChartProductos)}>Grafico Productos por Ubicaciones</button>
              )}
            </div>

          </div>
          {showEntradas ? (
            filteredEntradas.length > 0 && reportEntrada.length > 0 && !showChartEntradas &&(
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
                      <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                      <td style={{ fontWeight: 'bold' }}>{totalCantidadE.toFixed(2)}</td>
                      <td style={{ fontWeight: 'bold' }}>{totalCRC.toFixed(2)}</td>
                      <td style={{ fontWeight: 'bold' }}>{totalUSD.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )
          ) : showSalidas ? (
            filteredSalidas.length > 0 && reportSalida.length > 0 && !showChartSalidas &&(
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
                      <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                      <td style={{ fontWeight: 'bold' }}>{totalCantidadS.toFixed(2)}</td>
                      <td style={{ fontWeight: 'bold' }}>{totalCRCS.toFixed(2)}</td>
                      <td style={{ fontWeight: 'bold' }}>{totalUSDS.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )
          ) : (
            <>
              {!selectedUbicacion && !showChartProductos && productos.length > 0 && reportProducto.length > 0 && (
                <>
                  <h2>Reporte de Productos</h2>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Ubicación</th>
                        <th>Cantidad Total de Productos</th>
                        <th>Total en Colones</th>
                        <th>Total en Dólares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportProducto.map((datos) => (
                        <tr key={datos.ubicacion}>
                          <td>{datos.ubicacion}</td>
                          <td>{datos.cantidadTotal}</td>
                          <td>{datos.totalColones.toFixed(2)}</td>
                          <td>{datos.totalDolares.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={1} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCantidad.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCRCP.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalUSDP.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                </>
              )}
              {!showChartProductos && selectedUbicacion && reportProducto2.length > 0 && (
                <>
                  <h2>Productos en {selectedUbicacion}</h2>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Código del Producto</th>
                        <th>Nombre del Producto</th>
                        <th>Cantidad</th>
                        <th>Total en Colones</th>
                        <th>Total en Dólares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportProducto2.map((producto) => (
                        <tr key={producto.codigo}>
                          <td>{producto.codigo}</td>
                          <td>{producto.nombre}</td>
                          <td>{producto.cantidadTotal}</td>
                          <td>{producto.totalColones.toFixed(2)}</td>
                          <td>{producto.totalDolares.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                      <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales Globales:</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCantidadP.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalCRCP2.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold' }}>{totalUSDP2.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
          {activeCategory === 'productos' && showChartProductos && (
                <div style={{ width: '1500px', height: '720px'}}>
                  <Bar data={dataProductosChart} options={options('Top Ubicaciones con mayor cantidad de Productos')} />
                </div>
              )}
              {activeCategory === 'salidas' && showChartSalidas && (
                  <div style={{ width: '1500px', height: '720px'}}>
                    <Bar data={dataSalidasChart} options={options('Top Departamentos con mayores Salidas')} />
                  </div>
              )}
              {activeCategory === 'entradas' && showChartEntradas && (
                  <div style={{ width: '1500px', height: '720px'}}>
                    <Bar data={dataEntradasChart} options={options('Top Productos con mayores Entradas')} />
                  </div>
              )}
        </div>
      </main>
    </div>
  );
};

export default Home;