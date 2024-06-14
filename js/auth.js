document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const paginaActual = window.location.pathname.split('/').pop();

    if (usuario) {
        switch (usuario.rol) {
            case 1:
                if (paginaActual !== 'administrador.html') {
                    window.location.href = './administrador.html';
                }
                break;
            case 2:
                if (paginaActual !== 'cliente.html') {
                    window.location.href = './cliente.html';
                }
                break;
            default:
                // Si el rol no está definido correctamente, manejar el caso apropiado.
                alert('Rol de usuario no reconocido.');
                break;
        }
    } else {
        // Si no hay usuario almacenado y no estamos en login.html, redirigir a login.html
        if (paginaActual !== 'login.html' && paginaActual !== 'register.html') {
            window.location.href = './login.html';
        }
    }
});
