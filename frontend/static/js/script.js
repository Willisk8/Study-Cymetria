document.addEventListener('DOMContentLoaded', function() {

    var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});

    // Obtener el formulario de inicio de sesión por su ID
    const loginForm = document.getElementById('login-form');

    // Agregar un evento de escucha para el envío del formulario
    loginForm.addEventListener('submit', function(event) {
        // Evitar que el formulario se envíe automáticamente
        event.preventDefault();

        // Obtener los valores de nombre de usuario y contraseña del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Crear un objeto con los datos del formulario
        const formData = {
            username: username,
            password: password
        };

        // Realizar una solicitud POST al servidor con los datos del formulario
        fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // Verificar si la solicitud fue exitosa (código de estado 200)
                if (response.ok) {
                    myModal.show();
                }
                else {
                    // Mostrar un mensaje de error si las credenciales son inválidas
                    myModal.show();
                }
            })
            .catch(error => {
                // Mostrar un mensaje de error si ocurre un error en la solicitud
                console.error('Error al enviar la solicitud:', error);
                document.getElementById('login-message').textContent = 'Error de servidor';
            });
    });

    // Agregar evento al botón de cierre del modal
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        myModal.hide();
        window.location.href = '../templates/Productos.html';
    });

});
