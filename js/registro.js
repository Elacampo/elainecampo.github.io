const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});


function generarId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Caracteres permitidos
  let result = "";

  for (let i = 0; i < 3; i++) {
    // Generar una cadena de 3 caracteres
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function comprobarId(id, usuarios) {
  return usuarios && Object.values(usuarios).some((user) => user.id === id);
}

document.addEventListener("DOMContentLoaded", function () {
  const url =
    "https://sistema-mantenimientoweb-default-rtdb.firebaseio.com/usuarios.json";
  const registroForm = document.getElementById("registroForm");
  const submitButton = registroForm.querySelector('input[type="submit"]');

  submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    // Validación del formulario
    if (!validarFormulario()) {
      return; // Detener el proceso si la validación falla
  }

    const username = document.getElementById("username").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const password = document.getElementById("password").value;

    // Obtener la lista de usuarios existentes para determinar el último ID
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((usuarios) => {
        let randomId;

        do {
          randomId = generarId();
        } while (comprobarId(randomId, usuarios));

        // Datos del nuevo usuario
        const data = {
          id: randomId,
          username: username,
          password: password,
          nombre: nombre,
          apellido: apellido,
          rol: 2, // Esto es un ejemplo, ajusta según tu lógica de roles
        };

        // Configuración de la solicitud POST
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        // Realizar la solicitud POST para agregar el nuevo usuario
        return fetch(url, requestOptions);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos agregados correctamente:", data);
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Usuario registrado correctamente.",
        });
        // Limpiar el formulario después del registro (opcional)
        registroForm.reset();
        // Quitar el enfoque de los inputs
        inputs.forEach((input) => remcl.call(input));
      })
      .catch((error) => {
        console.error("Error al agregar datos:", error);
        // Mostrar mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al registrar el usuario.",
        });
      });
  });
});


function validarFormulario() {
  const username = document.getElementById("username").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const password = document.getElementById("password").value;

  // Validación de campos vacíos
  if (username === '' || nombre === '' || apellido === '' || password === '') {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Todos los campos son obligatorios'
      });
      return false;
  }

  // Validación de números en nombre y apellido
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(nombre) || !regex.test(apellido)) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Nombre y apellido no deben contener números'
      });
      return false;
  }

  return true; // Si pasa todas las validaciones
}