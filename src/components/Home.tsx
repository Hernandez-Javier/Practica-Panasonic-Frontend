import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import axios from 'axios';
import '../styles/home.css';
import PanasonicLogo from '../images/logo-Panasonic.png';
import ModalEntrada from './Entrada';
import ModalSalida from './Salida';
import ModalProducto from './NuevoProducto';
import ModalDevolucion from './Devolucion';
import ModalSalidaparticular from './SalidaParticular';
import ModalUbicacion from './Ubicacion'; // Importar el componente CRUD de Ubicaciones
import ModalDepartamento from './Departamento';
import ModalEditar from './EditProducto';
import ModalUsuario from './Usuario';
import ModalEditUsuario from './EditUsuario';
import ModalEditUbicacion from './EditUbicacion';

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

interface Usuario {
  identificacion: string;
  nombre: string;
  email: string;
  rol: string;
}

interface Data {
  id:number;
  nombre: string;
  descripcion: string;
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
  const [usuarios, setUsuarios] = useState<any[]>([]);//estado para la bitacora
  const [showUsuarios, setShowUsuarios] = useState(false);//estado para mostrar la bitacora
  const [error, setError] = useState('');
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [isEditarProductoModalOpen, setIsEditarProductoModalOpen] = useState(false);
  const [isEditarUsuarioModalOpen, setIsEditarUsuarioModalOpen] = useState(false);
  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [isSalidaModalOpen, setIsSalidaModalOpen] = useState(false);
  const [isDevolucionModalOpen, setIsDevolucionModalOpen] = useState(false);
  const [isSalidaParticularModalOpen, setIsSalidaParticularModalOpen] = useState(false);
  const [isUbicacionModalOpen, setIsUbicacionModalOpen] = useState(false);
  const [isEditUbicacionModalOpen, setIsEditUbicacionModalOpen] = useState(false);
  const [isEditDepartamentoModalOpen, setIsEditDepartamentoModalOpen] = useState(false);
  const [isDepartamentoModalOpen, setIsDepartamentoModalOpen] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null); // Estado para el producto seleccionado para editar
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null); // Estado para el producto seleccionado para editar
  const [datoSeleccionado, setDatoSeleccionado] = useState<Data | null>(null); // Estado para el producto seleccionado para editar
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(''); //guarda la categoria actual para que se muestre al usuario

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirigir al login si no hay token
    } else {
      fetchProductos();
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
      setShowUsuarios(false);
      setShowProductos(true);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  //mostrar usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(response.data);
      setShowSalidas(false);
      setShowEntradas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowBitacora(false);
      setShowProductos(false);
      setShowUsuarios(true);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
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
      setShowUsuarios(false);
      setShowBitacora(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //eliminar producto
  const handleDelete = async (codigo: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    const confirmarEliminar = window.confirm("¿Deseas eliminar este producto?");

    if (confirmarEliminar) {
      try {
        await axios.delete(`http://localhost:3000/productos/eliminar/${codigo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setProductos(productos.filter(producto => producto.codigo !== codigo));
      } catch (error) {
        console.error('Error eliminando el producto', error);
        setError('Error al eliminar el producto');
      }
    }
  };

  //eliminar ubicacion
  const handleDeleteUbicacion = async (nombre: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    const confirmarEliminar = window.confirm("¿Deseas eliminar esta ubicación?");

    if (confirmarEliminar) {
      try {
        await axios.delete(`http://localhost:3000/ubicaciones/eliminar/${nombre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.nombre !== nombre));
      } catch (error) {
        console.error('Error eliminando la ubicacion', error);
        setError('Error al eliminar la ubicacion');
      }
    }
    
  };

  //eliminar departamento
  const handleDeleteDepartamento = async (nombre: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    const confirmarEliminar = window.confirm("¿Deseas eliminar este departamento?");

    if (confirmarEliminar) {
      try {
        await axios.delete(`http://localhost:3000/departamentos/eliminar/${nombre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setDepartamentos(departamentos.filter(departamento => departamento.nombre !== nombre));
      } catch (error) {
        console.error('Error eliminando el producto', error);
        setError('Error al eliminar el producto');
      }
    }
  };

  //eliminar usuario
  const handleDeleteUsuario = async (id: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    const confirmarEliminar = window.confirm("¿Deseas eliminar este usuario?");

    if (confirmarEliminar) {
      try {
        await axios.delete(`http://localhost:3000/usuarios/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      } catch (error) {
        console.error('Error eliminando el usuario', error);
        setError('Error al eliminar el usuario');
      }
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

  //abrir modal de edicion producto
  const handleOpenEditarProductoModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setIsEditarProductoModalOpen(true);
  };

  //abrir modal de edicion de usuario
  const handleOpenEditarUsuarioModal = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setIsEditarUsuarioModalOpen(true);
  };

  //abrir modal de edicion de ubicacion
  const handleOpenEditarDataModal = (ubicacion: Data) => {
    setDatoSeleccionado(ubicacion);
    setIsEditUbicacionModalOpen(true);
  };

  //abrir modal de edicion de departmento
  const handleOpenEditarDepModal = (ubicacion: Data) => {
    setDatoSeleccionado(ubicacion);
    setIsEditDepartamentoModalOpen(true);
  };

  //editar producto
  const handleEditar = async (
    codigo: string,
    nombre: string,
    descripcion: string,
    ubicacion: number,
    proveedor: string,
    cantidad: number,
    cantidadMinima: number,
    precioUnidadCol: number,
    precioUnidadUSD: number,
    categoria: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/productos/modify/${codigo}`,
        {
          nombre,
          descripcion,
          ubicacion,
          proveedor,
          cantidad,
          cantidadMinima,
          precioUnidadCol,
          precioUnidadUSD,
          categoria
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchProductos();
      setIsEditarProductoModalOpen(false);
    } catch (error) {
      console.error('Error al editar el producto:', error);
    }
  };

  //editar usuario
  const handleEditarUsuario = async (
    identificacion: string,
    nombre: string,
    email: string,
    rol: string,
    contraseña: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/usuarios/modify/${identificacion}`,
        {
          identificacion,
          nombre,
          email,
          rol,
          contraseña
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchUsuarios();
      setIsEditarProductoModalOpen(false);
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };
  
  //editar ubicacion
  const handleEditarUbicacion = async (
    id: number,
    nombre: string,
    descripcion: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/ubicaciones/modificar/${id}`,
        {
          nombre,
          descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchUbicaciones(); // Asume que esta función recarga las ubicaciones desde la base de datos
      setIsEditUbicacionModalOpen(false); // Cierra el modal de edición
    } catch (error) {
      console.error('Error al editar la ubicación:', error);
    }
  };

  //modificar departamento
  const handleEditarDepartamento = async (
    id: number,
    nombre: string,
    descripcion: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/departamentos/modify/${id}`,
        {
          nombre,
          descripcion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchDepartamentos();
      setIsEditDepartamentoModalOpen(false);
    } catch (error) {
      console.error('Error al editar el departamento:', error);
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
      fetchProductos();
    } catch (error) {
      console.error('Error al realizar la entrada:', error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError('El producto con este código ya existe');
      } else {
        setError('Error al registrar el producto');
      }
    }
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
      fetchProductos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(error);
        throw { message: 'Producto no encontrado', statusCode: 404 };
      }
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.log(error);
        throw { message: 'La cantidad en inventario es muy baja', statusCode: 409 };
      } else {
        throw { message: 'Error al realizar la salida', statusCode: 500 };
      }
    }
  };

  //devolucion de producto
  const handleDevolucion = async (
      codigoProducto: string, 
      cantidad: number,
      motivo: string
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/productos/devolucion', {
        codigoProducto, 
        cantidad,
        motivo
      }, {
        headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de tener token definido antes de usarlo aquí
        },
      });
      fetchProductos();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw { message: 'Producto no encontrado', statusCode: 404 };
      } else {
        throw { message: 'Error al realizar la devolución', statusCode: 500 };
      }
    }
  };

  //salida particular
  const handleSalidaParticular = async (
    codigoProducto: string, 
    cantidad: number,
    motivo: string
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/productos/salida-particular', {
        codigoProducto, 
        cantidad,
        motivo
      }, {
        headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de tener token definido antes de usarlo aquí
        },
      });
      fetchProductos();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(error);
        throw { message: 'Producto no encontrado', statusCode: 404 };
      }
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.log(error);
        throw { message: 'La cantidad en inventario es muy baja', statusCode: 409 };
      } else {
        throw { message: 'Error al realizar la salida', statusCode: 500 };
      }
    }
  };

  //agregar producto
  const handleProductoNuevo = async (
    codigo: string, 
    nombre:string, 
    descripcion:string, 
    ubicacion:number,
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
      fetchProductos();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw { message: 'El producto con este código ya existe', statusCode: 404 };
      } else {
        throw { message: 'Error al registrar el producto', statusCode: 500 };
      }
    }
  };

  //agregar ubicacion
  const handleUbicacionNueva = async (
    nombre:string, 
    descripcion:string
    ) => {
    try {
      const response = await axios.post('http://localhost:3000/ubicaciones', {
        nombre, 
        descripcion
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUbicaciones();
      return response.data;
    } catch (error) {
      throw { message: 'Error al realizar la acción', statusCode: 500 };
    }
  };

  //agregar departamento
  const handleDepartamentoNuevo = async (
    nombre:string, 
    descripcion:string
    ) => {
    try {
      const response = await axios.post('http://localhost:3000/departamentos', {
        nombre, 
        descripcion
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      fetchDepartamentos();
    } catch (error) {
      throw { message: 'Error al realizar la acción', statusCode: 500 };
    }
  };

  //agregar usuario
  const handleUsuarioNuevo = async (
    identificacion: string, 
    nombre: string, 
    email: string, 
    rol: string, 
    contraseña: string
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/usuarios', {
        identificacion, 
        nombre, 
        email, 
        rol, 
        contraseña
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsuarios();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw { message: 'Un usuario con esta identificación o correo ya existe', statusCode: 404 };
      } else {
        throw { message: 'Error al registrar el usuario', statusCode: 500 };
      }
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
  const filteredEntradas = entradas.filter(entrada =>
    entrada.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entrada.ordencompra.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSalidas = salidas.filter(salida =>
    salida.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
          <h3>Menú Principal</h3>
        </div>
        <nav className="main-menu">
          <ul>
            <li><Link to="#" className={activeCategory === 'productos' ? 'active' : ''} onClick={() => {fetchProductos(); setActiveCategory('productos'); }}>Productos</Link></li>
            <li><Link to="#" className={activeCategory === 'entradas' ? 'active' : ''} onClick={() => {fetchEntradas(); setActiveCategory('entradas'); }}>Entradas de Inventario</Link></li>
            <li><Link to="#" className={activeCategory === 'salidas' ? 'active' : ''} onClick={() => {fetchSalidas(); setActiveCategory('salidas'); }}>Salidas de Inventario</Link></li>
            <li><Link to="#" className={activeCategory === 'salidasP' ? 'active' : ''} onClick={() => {fetchSalidasParticulares(); setActiveCategory('salidasP'); }}>Salidas Particulares</Link></li>
            <li><Link to="#" className={activeCategory === 'devolucionees' ? 'active' : ''} onClick={() => {fetchDevoluciones(); setActiveCategory('devoluciones'); }}>Devoluciones</Link></li>
            <li><Link to="#" className={activeCategory === 'ubicaciones' ? 'active' : ''} onClick={() => {fetchUbicaciones(); setActiveCategory('ubicaciones'); }}>Ubicaciones</Link></li>
            <li><Link to="#" className={activeCategory === 'departamentos' ? 'active' : ''} onClick={() => {fetchDepartamentos(); setActiveCategory('departamentos'); }}>Departamentos</Link></li>
            <li><Link to="#" className={activeCategory === 'usuarios' ? 'active' : ''} onClick={() => {fetchUsuarios(); setActiveCategory('usuarios'); }}>Usuarios</Link></li>
            <li><Link to="/reportes">Reportes</Link></li>
            <li><Link to="/upload">Cargar Datos</Link></li>
            <li><Link to="#" className={activeCategory === 'bitacora' ? 'active' : ''} onClick={() => {fetchBitacora(); setActiveCategory('bitacora'); }}>Bitácora de Actividad</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <div className="sticky-container">
          <div className="header-title">
            <span className="product-list-header">
              {showEntradas ? 'Lista de Entradas' : 
              showSalidas ? 'Lista de Salidas' : 
              showDevoluciones ? 'Lista de Devoluciones' : 
              showSalidasParticulares ? 'Lista de Salidas Particulares' :
              showBitacora ? 'Bitacora de Actividad' :
              showUbicaciones ? 'Lista de Ubicaciones' :
              showUsuarios ? 'Lista de Usuarios' :
              showDepartamentos ? 'Lista de Departamentos' :
              'Lista de Productos'}
            </span>
          </div>
          <div className="search-container">
            <div className="search-bar-container">
              <span className="search-label">Buscar:</span>
              <input
                type="text"
                placeholder="Escribe algo"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
            </div>
          </div>
        </div>
        <div className="contenedor-botones">
            {activeCategory === 'departamentos' && (
              <button className="add-product-button" onClick={() => setIsDepartamentoModalOpen(true)}>Agregar Departamento</button>
            )}
            {activeCategory === 'ubicaciones' && (
              <button className="add-product-button" onClick={() => setIsUbicacionModalOpen(true)}>Agregar Ubicación</button>
            )}
            {activeCategory === 'ubicaciones' && (
              <button className="add-product-button" onClick={() => setIsUbicacionModalOpen(true)}>Agregar Ubicación</button>
            )}
        </div>

        <div className="product-list"> 
          {showEntradas ? (
            filteredEntradas.length > 0 ? (
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
            ) : (
              <p>No hay entradas disponibles.</p>
            )
          ) : showSalidas ? (
            filteredSalidas.length > 0 ? (
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
          ) : showBitacora ? (
            filteredBitacora.length > 0 ? (
              <div className="product-grid">
                {filteredBitacora.map((registro) => (
                  <div key={registro.id} className="product-item">
                    <div className="product-column">
                      <p><strong>Usuario ID:</strong> {registro.usuarioid}</p>
                      <p><strong>Responsable:</strong> {registro.responsable}</p>
                      <p><strong>Detalles:</strong> {registro.detalles.replace(/["'{}]/g, '').replace(/,/g, ', ')}</p>
                    </div>
                    <div className="product-column">
                      <p><strong>Tipo de Actividad:</strong> {registro.tipoactividad}</p>
                      <p><strong>Actividad ID:</strong> {registro.actividadid}</p>
                      <p><strong>Fecha y Hora:</strong> {formatDate(registro.fechahora)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay salidas particulares disponibles.</p>
            )
          ) : showUsuarios ? (
            usuarios.length > 0 ? (
              <>
                <div className="contenedor-botones">
                  <button className="add-product-button" onClick={() => setIsUsuarioModalOpen(true)}>Agregar Usuario</button>
                </div>
                <div className="product-grid">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="product-item">
                      <div className="product-column">
                        <p><strong>ID:</strong> {usuario.identificacion}</p>
                        <p><strong>Nombre:</strong> {usuario.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> {usuario.email}</p>
                        <p><strong>Rol:</strong> {usuario.rol}</p>
                      </div>
                      <div className="products-buttons-column">
                        <div className="product-buttons">
                          <button onClick={() => handleOpenEditarUsuarioModal(usuario)}>Modificar</button>
                        </div>
                        <button className="delete-product-button" onClick={() => handleDeleteUsuario(usuario.id)}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No hay usuarios disponibles.</p>
            )
          ) : showUbicaciones ? (
              filteredUbicaciones.length > 0 ? (
                <>
                  <div className="product-grid">
                    {filteredUbicaciones.map((ubicacion) => (
                      <div key={ubicacion.id} className="product-item">
                        <div className="product-column">
                          <p><strong>ID:</strong> {ubicacion.id}</p>
                          <p><strong>Nombre:</strong> {ubicacion.nombre}</p>
                          <p><strong>Descripción:</strong> {ubicacion.descripcion}</p>
                        </div>
                        <div className="products-buttons-column">
                          <div className="product-buttons">
                            <button onClick={() => handleOpenEditarDataModal(ubicacion)}>Modificar</button>
                          </div>
                          <button className="delete-product-button" onClick={() => handleDeleteUbicacion(ubicacion.nombre)}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No hay ubicaciones disponibles.</p>
              )
          ) : 
          showDepartamentos ? (
              filteredDepartamentos.length > 0 ? (
                <>
                  <div className="product-grid">
                    {filteredDepartamentos.map((departamento) => (
                      <div key={departamento.id} className="product-item">
                        <div className="departamento-column">
                          <p><strong>ID:</strong> {departamento.id}</p>
                          <p><strong>Nombre:</strong> {departamento.nombre}</p>
                          <p><strong>Descripción:</strong> {departamento.descripcion}</p>
                        </div>
                        <div className="products-buttons-column">
                          <div className="product-buttons">
                            <button onClick={() => handleOpenEditarDepModal(departamento)}>Modificar</button>
                          </div>
                          <button className="delete-product-button" onClick={() => handleDeleteDepartamento(departamento.nombre)}>Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No hay departamentos disponibles.</p>
              )
          ) : (
            filteredProductos.length > 0 ? (
              <>
                <div className="contenedor-botones">
                  <button className="add-product-button" onClick={() => setIsProductoModalOpen(true)}>Agregar Producto Nuevo</button>
                  <button className="add-product-button" onClick={() => setIsDevolucionModalOpen(true)}>Devolución</button>
                  <button className="add-product-button" onClick={() => setIsSalidaParticularModalOpen(true)}>Salida Particular</button>
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
                      <div className="product-buttons-column">
                        <div className="product-buttons">
                          <button onClick={() => handleOpenEntradaModal(producto.codigo, producto.nombre)}>Entrada</button>
                          <button onClick={() => handleOpenSalidaModal(producto.codigo, producto.nombre)}>Salida</button>
                          <button onClick={() => handleOpenEditarProductoModal(producto)}>Editar</button>
                        </div>
                        <button className="delete-product-button" onClick={() => handleDelete(producto.codigo)}>Eliminar</button>
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

      <ModalEntrada
        isOpen={isEntradaModalOpen}
        onRequestClose={() => {setIsEntradaModalOpen(false)}}
        codigoProducto={codigoProducto} // Pasa el código del producto al modal de entrada
        nombreProducto={nombreProducto}
        onSubmit={handleEntrada}
      />
      <ModalSalida
        isOpen={isSalidaModalOpen}
        onRequestClose={() => {setIsSalidaModalOpen(false)}}
        codigoProducto={codigoProducto} // Pasa el código del producto al modal de entrada
        nombreProducto={nombreProducto}
        onSubmit={handleSalida}
      />
      <ModalProducto
        isOpen={isProductoModalOpen}
        onSubmit={handleProductoNuevo}
        onRequestClose={() => {setIsProductoModalOpen(false)}}
      />
      <ModalUsuario
        isOpen={isUsuarioModalOpen}
        onSubmit={handleUsuarioNuevo}
        onRequestClose={() => {setIsUsuarioModalOpen(false)}}
      />
      <ModalDevolucion
        isOpen={isDevolucionModalOpen}
        onRequestClose={() => {setIsDevolucionModalOpen(false)}}
        onSubmit={handleDevolucion}
      />
      <ModalSalidaparticular
        isOpen={isSalidaParticularModalOpen}
        onRequestClose={() => {setIsSalidaParticularModalOpen(false)}}
        onSubmit={handleSalidaParticular}
      />
      <ModalUbicacion
        isOpen={isUbicacionModalOpen}
        onRequestClose={() => {setIsUbicacionModalOpen(false)}}
        onSubmit={handleUbicacionNueva}
      />
      <ModalDepartamento
        isOpen={isDepartamentoModalOpen}
        onRequestClose={() => {setIsDepartamentoModalOpen(false)}}
        onSubmit={handleDepartamentoNuevo}
      />
      {productoSeleccionado && (
        <ModalEditar
          isOpen={isEditarProductoModalOpen}
          onRequestClose={() => setIsEditarProductoModalOpen(false)}
          onSubmit={handleEditar}
          codigo={productoSeleccionado.codigo}
          nombre={productoSeleccionado.nombre}
          descripcion={productoSeleccionado.descripcion}
          ubicacion={productoSeleccionado.ubicacion}
          proveedor={productoSeleccionado.proveedor}
          cantidad={productoSeleccionado.cantidad}
          cantidadMinima={productoSeleccionado.cantidadminima}
          precioUnidadCol={productoSeleccionado.preciounidadcol}
          precioUnidadUSD={productoSeleccionado.preciounidadusd}
          categoria={productoSeleccionado.categoria}
        />
      )}
      {usuarioSeleccionado && (
        <ModalEditUsuario
          isOpen={isEditarUsuarioModalOpen}
          onRequestClose={() => setIsEditarUsuarioModalOpen(false)}
          onSubmit={handleEditarUsuario}
          identificacion={usuarioSeleccionado.identificacion}
          nombre={usuarioSeleccionado.nombre}
          email={usuarioSeleccionado.email}
          rol={usuarioSeleccionado.rol}
        />
      )}
      {datoSeleccionado && (
        <ModalEditUbicacion
          isOpen={isEditUbicacionModalOpen}
          onRequestClose={() => setIsEditUbicacionModalOpen(false)}
          onSubmit={handleEditarUbicacion}
          id={datoSeleccionado.id}
          nombre={datoSeleccionado.nombre}
          descripcion={datoSeleccionado.descripcion}
          entidad='Ubicacion'
        />
      )}
      {datoSeleccionado && (
        <ModalEditUbicacion
          isOpen={isEditDepartamentoModalOpen}
          onRequestClose={() => setIsEditDepartamentoModalOpen(false)}
          onSubmit={handleEditarDepartamento}
          id={datoSeleccionado.id}
          nombre={datoSeleccionado.nombre}
          descripcion={datoSeleccionado.descripcion}
          entidad='Departamento'
        />
      )}
    </div>
  );
};

export default Home;