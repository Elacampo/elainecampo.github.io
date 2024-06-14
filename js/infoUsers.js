const usuario = JSON.parse(localStorage.getItem('usuario'));
const nombreUsuario = usuario.nombre[0].toUpperCase() + usuario.nombre.slice(1);
const apellidoUsuario = usuario.apellido[0].toUpperCase() + usuario.apellido.slice(1);


const nombreAdmin = document.querySelector('header h1')
const usuariosPorPagina = 8; // Número de usuarios por página -> 8 por defecto
let paginaActual = 1; // Página inicial
let datosUsuarios = []; // Array para almacenar todos los datos de usuarios

const cuerpoTabla = document.querySelector('tbody');
const apiUsuarios = 'https://sistema-mantenimientoweb-default-rtdb.firebaseio.com/usuarios.json'


nombreAdmin.innerHTML = `Bienvenido/a, ${nombreUsuario} ` + `${apellidoUsuario}!`

const getUsuarios = async () => {
    try {
        const response = await fetch(apiUsuarios);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} | ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        datosUsuarios = Object.values(data);

        // Mostrar la primera página inicialmente
        mostrarUsuariosPaginados();

    } catch (error) {
        console.error('Error en la red o en la API:', error);
    }
};

const mostrarUsuariosPaginados = () => {
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = datosUsuarios.slice(inicio, fin);

    let filasHTML = '';
    usuariosPagina.forEach(usuario => {
        let nombreRol = usuario.rol === 1 ? 'Admin' : usuario.rol === 2 ? 'Cliente' : 'Desconocido';

        filasHTML += `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.username}</td>
                <td>${nombreRol}</td>
            </tr>
        `;
    });

    cuerpoTabla.innerHTML = filasHTML;

    if (Math.ceil(datosUsuarios.length / usuariosPorPagina) > 1) {
        botonCargarMas.style.visibility = 'visible';
    } else {
        botonCargarMas.style.visibility = 'hidden';
    }

    if (paginaActual > 1) {
        botonCargarMenos.style.visibility = 'visible';
    } else {
        botonCargarMenos.style.visibility = 'hidden';
    }
};

const botonCargarMas = document.getElementById('botonCargarMas');
const botonCargarMenos = document.getElementById('botonCargarMenos');


botonCargarMas.addEventListener('click', () => {
    if (paginaActual < Math.ceil(datosUsuarios.length / usuariosPorPagina)) {
        paginaActual++;
        mostrarUsuariosPaginados();
        
        if (paginaActual === Math.ceil(datosUsuarios.length / usuariosPorPagina)) {
            botonCargarMas.style.visibility = 'hidden';
        }

        botonCargarMenos.style.visibility = 'visible';
    }
});

botonCargarMenos.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarUsuariosPaginados();
        // Mostrar u ocultar el botón de cargar más al retroceder página
        if (paginaActual < Math.ceil(datosUsuarios.length / usuariosPorPagina)) {
            botonCargarMas.style.visibility = 'visible';
        }
        // Ocultar el botón de cargar menos si volvemos a la primera página
        if (paginaActual === 1) {
            botonCargarMenos.style.visibility = 'hidden';
        }
    }
});


getUsuarios();

