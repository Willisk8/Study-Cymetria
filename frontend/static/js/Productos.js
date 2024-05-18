document.addEventListener('DOMContentLoaded', function () {
    
    cargarCategorias();
    
    cargarProductos();
    
    var modal = new bootstrap.Modal(document.getElementById("ModalRegistro"), {});

    // Evento para mostrar el modal cuando se hace clic en el botón "Agregar Producto"
    document.getElementById('btn-nuevo-producto').addEventListener('click', function () {
        cargarCategorias(); // Cargar categorías cuando se abre el modal
        modal.show();
    });

   // Evento para registrar un nuevo producto
    document.querySelector('.btn-primary').addEventListener('click', function () {
        const nombre = document.getElementById('nombre-producto').value;
        const descripcion = document.getElementById('descripcion-producto').value;
        const precio = document.getElementById('precio-producto').value;
        const stock = document.getElementById('stock-producto').value;
        const categoria = document.getElementById('categoria-producto').value;
        

        // Validar campos del formulario
        if (nombre && descripcion && precio && stock && categoria) {
            const producto = {
                nombre: nombre,
                descripcion: descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria_id: parseInt(categoria)
            };

            // Enviar datos al servidor
            fetch('/agregar_producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error en la solicitud');
                }
            })
            .then(data => {
                if (data.success) {
                    cargarProductos(); // Recargar productos
                    modal.hide(); // Cerrar modal
                } else {
                    alert('Error al registrar el producto');
                }
            })
            .catch(error => {
                console.error('Error al registrar el producto:', error);
            });
        } else {
            alert('Por favor complete todos los campos');
        }
    });
});


function cargarCategorias() {
    const filtroCategorias = document.querySelectorAll('#categoria, #categoria-producto');
    filtroCategorias.forEach(filtroCategoria => {
        fetch('/categorias')
            .then(response => response.json())
            .then(data => {
                filtroCategoria.innerHTML = ''; // Limpiar opciones anteriores
                const todasOption = document.createElement('option');
                todasOption.value = 0;
                todasOption.textContent = 'Todas';
                filtroCategoria.appendChild(todasOption);

                for (const categoria of data) {
                    const option = document.createElement('option');
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    filtroCategoria.appendChild(option);
                }
            })
            .catch(error => console.error('Error al cargar las categorías:', error));
    });
}

function cargarProductos() {
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tabla-productos tbody');
            tbody.innerHTML = ''; // Limpiar filas anteriores

            for (const producto of data) {
                const tr = document.createElement('tr');

                const nombreTd = document.createElement('td');
                nombreTd.textContent = producto.nombre;
                tr.appendChild(nombreTd);

                const descripcionTd = document.createElement('td');
                descripcionTd.textContent = producto.descripcion;
                tr.appendChild(descripcionTd);

                const precioTd = document.createElement('td');
                precioTd.textContent = producto.precio;
                tr.appendChild(precioTd);

                const stockTd = document.createElement('td');
                stockTd.textContent = producto.stock;
                tr.appendChild(stockTd);

                const categoriaTd = document.createElement('td');
                categoriaTd.textContent = producto.categoria;
                tr.appendChild(categoriaTd);

                tbody.appendChild(tr);
            }
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}
