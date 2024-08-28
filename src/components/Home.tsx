import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../api';
import '../styles/home.css';
import PanasonicLogo from '../images/logo-Panasonic.png';
import ModalEntrada from './Entrada';
import ModalSalida from './Salida';
import ModalProducto from './NuevoProducto';
import ModalDevolucion from './Devolucion';
import ModalSalidaparticular from './SalidaParticular';
import ModalUbicacion from './Ubicacion';
import ModalDepartamento from './Departamento';
import ModalEditar from './EditProducto';
import ModalUsuario from './Usuario';
import ModalEditUsuario from './EditUsuario';
import ModalEditUbicacion from './EditUbicacion';
import Export from './Export';

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
  const [salidasParticulares, setSalidasParticulares] = useState<any[]>([]);//estado para las salidas particulares
  const [showSalidasParticulares, setShowSalidasParticulares] = useState(false);//estado par mostrar las salidas particulares
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);//estado para las ubicaciones
  const [showUbicaciones, setShowUbicaciones] = useState(false);//estado par mostrar ubicaciones
  const [departamentos, setDepartamentos] = useState<any[]>([]);//estado para los departamentos
  const [showDepartamentos, setShowDepartamentos] = useState(false);//estado par mostrar departamentos
  const [bitacora, setBitacora] = useState<any[]>([]);//estado para la bitacora
  const [showBitacora, setShowBitacora] = useState(false);//estado para mostrar la bitacora
  const [usuarios, setUsuarios] = useState<any[]>([]);//estado para los usuarios
  const [showUsuarios, setShowUsuarios] = useState(false);//estado para mostrar los usuarios
  const [emails, setEmails] = useState<any[]>([]);//estado para los emails
  const [showEmails, setShowEmails] = useState(false);//estado para mostrar los emails
  const [email, setEmail] = useState<string | null>(null);//estado para los email que se van a agregar
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
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null); // Estado para el usuario seleccionado para editar
  const [datoSeleccionado, setDatoSeleccionado] = useState<Data | null>(null); // guarda depto o ubicacion seleccionado para editar
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(''); //guarda la categoria actual para que se muestre al usuario
  //paginacion de los productos
  const [currentPage, setCurrentPage] = useState(1); //estado para saber la pag actual
  const productsPerPage = 20; // productos pr pagina
  const topRef = useRef<HTMLDivElement>(null);//para regresar al inicio de la pag al cambiar pag

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let usuarioNombre = 'Usuario';
  let rol = '';

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
      rol = decodedToken.rol;
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handlePageChange(1);
  };

  const handlePagination = (total:number) => {
    return(
      <div className="pagination">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Inicio
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        {getPageNumbers(total).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages(total)}>
          Siguiente
        </button>
      </div>
    )
  }

  //mostrar productos
  const fetchProductos = async () => {
    try {
      const response = await api.get('/productos/all', {
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
      setShowEmails(false);
      setShowProductos(true);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  //mostrar usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios', {
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
      setShowEmails(false);
      setShowUsuarios(true);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  //mostrar entradas
  const fetchEntradas = async () => {
    try {
      const response = await api.get('/entradas/all', {
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
      setShowEmails(false);
      setShowEntradas(true);
    } catch (error) {
      console.error('Error fetching entradas:', error);
    }
  };

  //mostrar salidas
  const fetchSalidas = async () => {
    try {
      const response = await api.get('/salidas/all', {
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
      setShowEmails(false);
      setShowSalidas(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar devoluciones
  const fetchDevoluciones = async () => {
    try {
      const response = await api.get('/devoluciones/all', {
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
      setShowEmails(false);
      setShowDevoluciones(true);
    } catch (error) {
      console.error('Error fetching devoluciones:', error);
    }
  };

  //mostrar salidas particulares
  const fetchSalidasParticulares = async () => {
    try {
      const response = await api.get('/salidas-particulares/all', {
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
      setShowEmails(false);
      setShowSalidasParticulares(true);
    } catch (error) {
      console.error('Error fetching salidas particulares:', error);
    }
  };

  //mostrar ubicaciones
  const fetchUbicaciones = async () => {
    try {
      const response = await api.get('/ubicaciones/all', {
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
      setShowEmails(false);
      setShowUbicaciones(true);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
    }
  };

  //mostrar departamentos
  const fetchDepartamentos = async () => {
    try {
      const response = await api.get('/departamentos/all', {
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
      setShowEmails(false);
      setShowDepartamentos(true);
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    }
  };

  //mostrar bitacora
  const fetchBitacora = async () => {
    try {
      const response = await api.get('/bitacora/all', {
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
      setShowEmails(false);
      setShowBitacora(true);
    } catch (error) {
      console.error('Error fetching salidas:', error);
    }
  };

  //mostrar emails
  const fetchEmails = async () => {
    try {
      const response = await api.get('/notif/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmails(response.data);
      setShowProductos(false);
      setShowEntradas(false);
      setShowSalidas(false);
      setShowDevoluciones(false);
      setShowSalidasParticulares(false);
      setShowUbicaciones(false);
      setShowDepartamentos(false);
      setShowUsuarios(false);
      setShowBitacora(false);
      setShowEmails(true);
    } catch (error) {
      console.error('Error fetching emails:', error);
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
        await api.delete(`/productos/eliminar/${codigo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setProductos(productos.filter(producto => producto.codigo !== codigo));
        toast.success('Producto eliminado');
      } catch (error) {
        console.error('Error eliminando el producto', error);
        setError('Error al eliminar el producto');
        toast.error('Error eliminando el producto');
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
        await api.delete(`/ubicaciones/eliminar/${nombre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        toast.success('Ubicacion eliminada');
        setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.nombre !== nombre));
      } catch (error) {
        console.error('Error eliminando la ubicacion', error);
        setError('Error al eliminar la ubicacion');
        toast.error('No se pudo eliminar. Revisa que no existan productos registrados en esta ubicación');
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
        await api.delete(`/departamentos/eliminar/${nombre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setDepartamentos(departamentos.filter(departamento => departamento.nombre !== nombre));
        toast.success('Departamento eliminado');
      } catch (error) {
        console.error('Error eliminando el producto', error);
        setError('Error al eliminar el producto');
        toast.error('Error eliminando el departamento');
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
        await api.delete(`/usuarios/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        toast.success('Usuario eliminado');
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      } catch (error) {
        console.error('Error eliminando el usuario', error);
        setError('Error al eliminar el usuario');
        toast.error('No se puede eliminar ese usuario');
      }
    }
  };

  //eliminar email de notificaciones
  const handleDeleteEmail = async (id: string) => {
    if (!token) {
      setError('Token de autorización no proporcionado');
      return;
    }

    const confirmarEliminar = window.confirm("¿Deseas eliminar este email?");

    if (confirmarEliminar) {
      try {
        await api.delete(`/notif/eliminar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setEmails(emails.filter(email => email.id !== id));
        toast.success('Email eliminado');
      } catch (error) {
        console.error('Error eliminando el email', error);
        setError('Error al eliminar el email');
        toast.error('Error eliminando el email');
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
  const handleOpenEditarDepModal = (departamento: Data) => {
    setDatoSeleccionado(departamento);
    setIsEditDepartamentoModalOpen(true);
  };

  //modificar producto
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
      const response = await api.put(
        `/productos/modify/${codigo}`,
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
      
      fetchProductos();
      toast.success('Producto modificado con éxito!');
      setIsEditarProductoModalOpen(false);
    } catch (error) {
      toast.error('Error al editar producto, vuelve a intentarlo');
      console.error('Error al editar el producto:', error);
    }
  };

  //modificar usuario
  const handleEditarUsuario = async (
    identificacion: string,
    nombre: string,
    email: string,
    rol: string,
    contraseña: string
  ) => {
    try {
      const response = await api.put(
        `/usuarios/modify/${identificacion}`,
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
      fetchUsuarios();
      toast.success('Ususario modificado con éxito!');
      setIsEditarProductoModalOpen(false);
    } catch (error) {
      console.error('Error al editar el usuario:', error);
      toast.error('No se pudo modificar');
    }
  };
  
  //Modificar ubicacion
  const handleEditarUbicacion = async (
    id: number,
    nombre: string,
    descripcion: string
  ) => {
    try {
      const response = await api.put(
        `/ubicaciones/modificar/${id}`,
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
      
      fetchUbicaciones(); // Asume que esta función recarga las ubicaciones desde la base de datos
      setIsEditUbicacionModalOpen(false); // Cierra el modal de edición
    } catch (error) {
      console.error('Error al editar la ubicación:', error);
    }
    toast.success('Ubicacion modificada con éxito!');
  };

  //modificar departamento
  const handleEditarDepartamento = async (
    id: number,
    nombre: string,
    descripcion: string
  ) => {
    try {
      const response = await api.put(
        `/departamentos/modify/${id}`,
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
      
      fetchDepartamentos();
      setIsEditDepartamentoModalOpen(false);
    } catch (error) {
      console.error('Error al editar el departamento:', error);
    }
    toast.success('Departamento modificado con éxito!');
  };
  
  //entrada de un producto
  const handleEntrada = async (codigoProducto: string, cantidad: number, ordenCompra: string) => {
    try {
      const response = await api.post('/productos/entrada', {
        codigoProducto,
        cantidad,
        ordenCompra
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      fetchProductos();
    } catch (error) {
      console.error('Error al realizar la entrada:', error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError('El producto con este código ya existe');
      } else {
        setError('Error al registrar el producto');
      }
    }
    toast.success('Entrada realizadad con éxito!');
  };

  //salida de un producto
  const handleSalida = async (codigoProducto: string, cantidad: number, destino:string, solicitante:string) => {
    try {
      const response = await api.post('/productos/salida', {
        codigoProducto,
        cantidad,
        destino,
        solicitante
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
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
    toast.success('Salida realizada con éxito!');
  };

  //devolucion de producto
  const handleDevolucion = async (
      codigoProducto: string, 
      cantidad: number,
      motivo: string
  ) => {
    try {
      const response = await api.post('/productos/devolucion', {
        codigoProducto, 
        cantidad,
        motivo
      }, {
        headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de tener token definido antes de usarlo aquí
        },
      });
      fetchProductos();
      toast.success('Devolucion realizada con éxito!');
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
      const response = await api.post('/productos/salida-particular', {
        codigoProducto, 
        cantidad,
        motivo
      }, {
        headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de tener token definido antes de usarlo aquí
        },
      });
      fetchProductos();
      toast.success('Salida Particular realizada con éxito!');
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
      const response = await api.post('/productos', {
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
      toast.success('Producto agregado con éxito!');
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
      const response = await api.post('/ubicaciones', {
        nombre, 
        descripcion
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUbicaciones();
      toast.success('Ubicación agregada con éxito!');
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
      const response = await api.post('/departamentos', {
        nombre, 
        descripcion
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Departamento agregado con éxito!');
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
      const response = await api.post('/usuarios', {
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
      toast.success('Usuario agregado con éxito!');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw { message: 'Un usuario con esta identificación o correo ya existe', statusCode: 404 };
      } else {
        throw { message: 'Error al registrar el usuario', statusCode: 500 };
      }
    }
  };

  //agregar email de notificaciones
  const handleEmailNuevo = async (email:string) => {
    try {
      const response = await api.post('/notif', {
        email
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Email agregado con éxito!');
      fetchEmails();
      return response.data;
    } catch (error) {
      toast.error('No se agregó el email');
    }
  };

  //llama a la función de agregar emails
  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      handleEmailNuevo(email); // Llama a la función handleEmailNuevo con el email actual
      setEmail(null); // Limpiar el input después de agregar el email
    }
  };

  //mostrar productos en cantidad minima
  const cantidadMinima = async () => {
    try {
      const response = await api.get('/productos/cantidad-minima', {
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
    (entrada.codigoproducto && entrada.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entrada.ordencompra && entrada.ordencompra.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredSalidas = salidas.filter(salida =>
    (salida.codigoproducto && salida.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredDevoluciones = devoluciones.filter(devolucion =>
    devolucion.codigoproducto && devolucion.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSalidasParticulares = salidasParticulares.filter(salidaParticular =>
    salidaParticular.codigoproducto && salidaParticular.codigoproducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProductos = productos.filter(producto =>
    (producto.codigo && producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUbicaciones = ubicaciones.filter(ubicacion =>
    ubicacion.nombre && ubicacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.nombre && departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredBitacora = bitacora.filter(bit =>
    (bit.tipoactividad && bit.tipoactividad.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (bit.responsable && bit.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
);

  //pasar pagina
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  //calcula el num de paginas
  const getPageNumbers = (num:number) => {
    const startPage = Math.max(1, currentPage - Math.floor(4 / 2));
    const endPage = Math.min(totalPages(num), startPage + 4 - 1);
  
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  //
  const calculatePagination = (items: any[]) => {
    const indexOfLastItem = currentPage * productsPerPage;
    const indexOfFirstItem = indexOfLastItem - productsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    return currentItems;
  };

  const totalPages = (num :number) => {
    return Math.ceil(num / productsPerPage);
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
          <h3>Menú Principal</h3>
        </div>
        <nav className="main-menu">
          <ul>
            <li><Link to="#" className={activeCategory === 'productos' ? 'active' : ''} onClick={() => {fetchProductos(); setActiveCategory('productos'); setCurrentPage(1);}}>Productos</Link></li>
            <li><Link to="#" className={activeCategory === 'entradas' ? 'active' : ''} onClick={() => {fetchEntradas(); setActiveCategory('entradas'); setCurrentPage(1);}}>Entradas de Inventario</Link></li>
            <li><Link to="#" className={activeCategory === 'salidas' ? 'active' : ''} onClick={() => {fetchSalidas(); setActiveCategory('salidas'); setCurrentPage(1);}}>Salidas de Inventario</Link></li>
            <li><Link to="#" className={activeCategory === 'salidasP' ? 'active' : ''} onClick={() => {fetchSalidasParticulares(); setActiveCategory('salidasP'); setCurrentPage(1);}}>Salidas Particulares</Link></li>
            <li><Link to="#" className={activeCategory === 'devoluciones' ? 'active' : ''} onClick={() => {fetchDevoluciones(); setActiveCategory('devoluciones'); setCurrentPage(1);}}>Devoluciones</Link></li>
            <li><Link to="#" className={activeCategory === 'ubicaciones' ? 'active' : ''} onClick={() => {fetchUbicaciones(); setActiveCategory('ubicaciones'); setCurrentPage(1);}}>Ubicaciones</Link></li>
            <li><Link to="#" className={activeCategory === 'departamentos' ? 'active' : ''} onClick={() => {fetchDepartamentos(); setActiveCategory('departamentos'); setCurrentPage(1);}}>Departamentos</Link></li>
            {rol === 'Admin' && (
              <li><Link to="#" className={activeCategory === 'usuarios' ? 'active' : ''} onClick={() => {fetchUsuarios(); setActiveCategory('usuarios'); setCurrentPage(1);}}>Usuarios</Link></li>
            )}
            {rol === 'Admin' && (
              <li><Link to="#" className={activeCategory === 'emails' ? 'active' : ''} onClick={() => {fetchEmails(); setActiveCategory('emails'); setCurrentPage(1);}}>Email de Notificaciones</Link></li>
            )}
            <li><Link to="#" className={activeCategory === 'bitacora' ? 'active' : ''} onClick={() => {fetchBitacora(); setActiveCategory('bitacora'); setCurrentPage(1);}}>Bitácora de Actividad</Link></li>
            <li><Link to="/reportes">Reportes</Link></li>
            <li><Link to="/upload">Cargar Datos</Link></li>
            <li><Export productos={productos} /></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
      <div ref={topRef}></div>
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
              showEmails ? 'Lista de Emails para Notificaciones' :
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
              <div className="product-buttons">
                <button onClick={() => {setSearchTerm(''); handlePageChange(1)}}>
                  Limpiar
                </button>
              </div>
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
            {activeCategory === 'emails' && (
              <form onSubmit={handleAddEmail} className="email-form">
                <input
                  type="email"
                  placeholder="Agregar Email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Agregar</button>
              </form>
            )}
            {activeCategory === 'usuarios' && (
              <button className="add-product-button" onClick={() => setIsUsuarioModalOpen(true)}>Agregar Usuario</button>
            )}
        </div>

        <div className="product-list"> 
          {showEntradas ? (
            filteredEntradas.length > 0 ? (
              <>
              <div className="product-grid">
                {calculatePagination(filteredEntradas).map((entrada) => (
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
              {handlePagination(filteredEntradas.length)}
              </>
            ) : (
              <p>No hay entradas disponibles.</p>
            )
          ) : showSalidas ? (
            filteredSalidas.length > 0 ? (
              <>
              <div className="product-grid">
                {calculatePagination(filteredSalidas).map((salida) => (
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
              {handlePagination(filteredSalidas.length)}
              </>
            ) : (
              <p>No hay salidas disponibles.</p>
            )
          ) : showDevoluciones ? (
            filteredDevoluciones.length > 0 ? (
              <>
              <div className="product-grid">
                {calculatePagination(filteredDevoluciones).map((devolucion) => (
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
              {handlePagination(filteredDevoluciones.length)}
              </>
            ) : (
              <p>No hay devoluciones disponibles.</p>
            )
          ) : showSalidasParticulares ? (
            filteredSalidasParticulares.length > 0 ? (
              <>
              <div className="product-grid">
                {calculatePagination(filteredSalidasParticulares).map((salidaParticular) => (
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
              {handlePagination(filteredSalidasParticulares.length)}
              </>
            ) : (
              <p>No hay salidas particulares disponibles.</p>
            )
          ) : showBitacora ? (
            filteredBitacora.length > 0 ? (
              <>
              <div className="product-grid">
                {calculatePagination(filteredBitacora).map((registro) => (
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
              {handlePagination(filteredBitacora.length)}
              </>
            ) : (
              <p>No hay salidas particulares disponibles.</p>
            )
          ) : showUsuarios ? (
            usuarios.length > 0 ? (
              <>
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
                          <button className="modificar-button" onClick={() => handleOpenEditarUsuarioModal(usuario)}>Modificar</button>
                          <button className="modificar-button" onClick={() => handleDeleteUsuario(usuario.id)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {handlePagination(usuarios.length)}
              </>
            ) : (
              <p>No hay usuarios disponibles.</p>
            )
          ) : showUbicaciones ? (
              filteredUbicaciones.length > 0 ? (
                <>
                  <div className="product-grid">
                    {calculatePagination(filteredUbicaciones).map((ubicacion) => (
                      <div key={ubicacion.id} className="product-item">
                        <div className="product-column">
                          <p><strong>ID:</strong> {ubicacion.id}</p>
                          <p><strong>Nombre:</strong> {ubicacion.nombre}</p>
                          <p><strong>Descripción:</strong> {ubicacion.descripcion}</p>
                        </div>
                        <div className="products-buttons-column">
                          <div className="product-buttons">
                            <button className="modificar-button" onClick={() => handleOpenEditarDataModal(ubicacion)}>Modificar</button>
                            <button className="modificar-button" onClick={() => handleDeleteUbicacion(ubicacion.nombre)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {handlePagination(filteredUbicaciones.length)}
                </>
              ) : (
                <p>No hay ubicaciones disponibles.</p>
              )
            ) : showDepartamentos ? (
              filteredDepartamentos.length > 0 ? (
                <>
                  <div className="product-grid">
                    {calculatePagination(filteredDepartamentos).map((departamento) => (
                      <div key={departamento.id} className="product-item">
                        <div className="departamento-column">
                          <p><strong>ID:</strong> {departamento.id}</p>
                          <p><strong>Nombre:</strong> {departamento.nombre}</p>
                          <p><strong>Descripción:</strong> {departamento.descripcion}</p>
                        </div>
                        <div className="products-buttons-column">
                          <div className="product-buttons">
                            <button className="modificar-button" onClick={() => handleOpenEditarDepModal(departamento)}>Modificar</button>
                            <button className="modificar-button" onClick={() => handleDeleteDepartamento(departamento.nombre)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {handlePagination(filteredDepartamentos.length)}
                </>
              ) : (
                <p>No hay departamentos disponibles.</p>
              )
            ) : showEmails ? (
              emails.length > 0 ? (
                <>
                  <div className="product-grid">
                    {emails.map((email) => (
                      <div key={email.id} className="product-item">
                        <div className="product-column">
                          <p><strong>Email:</strong> {email.email}</p>
                        </div>
                        <div className="products-buttons-column">
                          <div className="product-buttons">
                            <button className="modificar-button" onClick={() => handleDeleteEmail(email.id)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {handlePagination(emails.length)}
                </>
              ) : (
                <p>No hay ubicaciones disponibles.</p>
              )
          ) : (
            filteredProductos.length > 0 ? (
              <>
                <div className="Product-header">
                  <div className="contenedor-botones">
                    <button className="add-product-button" onClick={() => setIsProductoModalOpen(true)}>Agregar Producto Nuevo</button>
                    <button className="add-product-button" onClick={() => setIsDevolucionModalOpen(true)}>Devolución</button>
                    <button className="add-product-button" onClick={() => setIsSalidaParticularModalOpen(true)}>Salida Particular</button>
                    <button className="add-product-button" style={{ backgroundColor: '#7a2a20', color: 'white' }} onClick={() => cantidadMinima()}>Inventario Minimo</button>
                  </div>
                </div>

                <div className="product-grid">
                  {calculatePagination(filteredProductos).map((producto) => (
                    <div key={producto.id} className="product-item">
                      <div className="product-column">
                        <p><strong>Código:</strong> {producto.codigo}</p>
                        <p><strong>Nombre:</strong> {producto.nombre}</p>
                        <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                        <p><strong>Cantidad Mínima:</strong> {producto.cantidadminima}</p>
                        <p><strong>Descripción:</strong> {producto.descripcion && producto.descripcion.length > 85 ? `${producto.descripcion.substring(0, 85)}...` : producto.descripcion}</p>
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
                          <button className="entrada-button" onClick={() => handleOpenEntradaModal(producto.codigo, producto.nombre)}>Entrada</button>
                          <button className="salida-button" onClick={() => handleOpenSalidaModal(producto.codigo, producto.nombre)}>Salida</button>
                          <button className="modificar-button" onClick={() => handleOpenEditarProductoModal(producto)}>Modificar</button>
                          {rol === 'Admin' && (
                            <button className="modificar-button" onClick={() => handleDelete(producto.codigo)}>Eliminar</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {handlePagination(filteredProductos.length)}
              </>
            ) : (
              <>
              <div className="Product-header">
                <div className="contenedor-botones">
                  <button className="add-product-button" onClick={() => setIsProductoModalOpen(true)}>Agregar Producto Nuevo</button>
                </div>
              </div>
              <p>No hay productos disponibles.</p>
            </>
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