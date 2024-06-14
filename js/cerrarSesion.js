const cerrarSesion = document.getElementById('cerrarSesionBtn');

cerrarSesion.addEventListener('click', () =>{
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
})