const usuario = JSON.parse(localStorage.getItem('usuario'));
const nombreUsuario = usuario.nombre[0].toUpperCase() + usuario.nombre.slice(1);
const apellidoUsuario = usuario.apellido[0].toUpperCase() + usuario.apellido.slice(1);


const nombreCliente = document.querySelector('header h1')
const productosPorPagina = 8; // Número de usuarios por página
let paginaActual = 1; // Página inicial
let datosProducto = []; // Array para almacenar todos los datos de usuarios

const cuerpoTabla = document.querySelector('tbody');
const apiProductos = 'https://sistema-mantenimientoweb-default-rtdb.firebaseio.com/productos.json'

nombreCliente.innerHTML = `Bienvenido/a, ${nombreUsuario} ` + `${apellidoUsuario}!`

const getProductos = async() =>{
    try {
        const response = await fetch(apiProductos);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} | ${response.statusText}`);
        }

        const data = await response.json();
        datosProductos = Object.values(data);

        mostrarProductosPaginados();

        
    } catch (error) {
        console.error('Error en la red o en la API:', error);
    }
}

const mostrarProductosPaginados = () =>{
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = datosProductos.slice(inicio,fin);

    let filasHTML = '';

    productosPagina.forEach(producto =>{
        const fechaFormateada = formatearFecha(producto.fecha_vencimiento);
        const precioFormateado = formatearPrecio(producto.precio_cop);

        filasHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.stock}</td>
                <td>${precioFormateado}</td>
                <td>${fechaFormateada}</td>
            </tr>
        `;
    });

    cuerpoTabla.innerHTML = filasHTML;

    if (Math.ceil(datosProductos.length / productosPorPagina) > 1) {
        botonCargarMas.style.visibility = 'visible';
    } else {
        botonCargarMas.style.visibility = 'hidden';
    }

    if (paginaActual > 1) {
        botonCargarMenos.style.visibility = 'visible';
    } else {
        botonCargarMenos.style.visibility = 'hidden';
    }
}

const botonCargarMas = document.getElementById('botonCargarMas');
const botonCargarMenos = document.getElementById('botonCargarMenos');

botonCargarMas.addEventListener('click', () =>{
    if(paginaActual < Math.ceil(datosProductos.length / productosPorPagina)){
        paginaActual++;
        mostrarProductosPaginados();

        if (paginaActual === Math.ceil(datosProductos.length / productosPorPagina)) {
            botonCargarMas.style.visibility = 'hidden';
        }

        botonCargarMenos.style.visibility = 'visible';
    }
})

botonCargarMenos.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarProductosPaginados();

        if (paginaActual < Math.ceil(datosProductos.length / productosPorPagina)) {
            botonCargarMas.style.visibility = 'visible';
        }
        // Ocultar el botón de cargar menos si volvemos a la primera página
        if (paginaActual === 1) {
            botonCargarMenos.style.visibility = 'hidden';
        }
    }
});

const formatearPrecio = (precio_cop) =>{
    return precio_cop.toLocaleString('es-ES');
}

const formatearFecha = (fecha) =>{
    const fechaVencimiento = new Date(fecha);
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    return fechaVencimiento.toLocaleDateString('es-Es', opcionesFecha)
}

getProductos(); 