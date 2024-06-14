const inputs = document.querySelectorAll(".input");
var nombre = document.getElementById("nombre");

// Función para agregar clase y placeholder al enfocar
function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
	if(this.type == "text"){
		this.setAttribute("placeholder", "Ingrese su usuario");
	} else if(this.type == "password"){
		this.setAttribute("placeholder", "Ingrese su contraseña");
	}

}

// Función para quitar clase y placeholder al perder el foco
function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
		this.removeAttribute("placeholder");
	}
}	

inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

// LOGIN

document.getElementById('loginForm').addEventListener('submit', async (event) => {
	event.preventDefault();

	const nombreUsuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

	if(nombreUsuario === '' || password === ''){
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Los campos de usuario y/o contraseña no pueden estar vacíos.'
		  });
	}else{
		try {
	
			//API con los datos JSON
			const response = await fetch('https://sistema-mantenimientoweb-default-rtdb.firebaseio.com/usuarios.json');
			const data = await response.json();

			const usuarios = Object.values(data);
			
			console.log(usuarios[6]);

			const loginUsuario = usuarios.find(usuario => usuario.username === nombreUsuario && usuario.password === password);

			if(loginUsuario){
				// Almacenar datos del usuario en localStorage
                localStorage.setItem('usuario', JSON.stringify(loginUsuario));

				// Redirigir a la página correspondiente según el rol
				switch (loginUsuario.rol) {
					case 1:
						window.location.href = './administrador.html'
						break;
					case 2:
						window.location.href = './cliente.html'
						break;
					default:
						alert('Rol de usuario no reconocido.');
						break;
				}
			}else{
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Usuario o contraseña incorrecto.'
				  });
			}
	
		} catch (error) {
			console.error('Se encontró un error:', error);
		}
	}

});

