const contenidoPlatillo = document.querySelector('#platillos .contenido');
const contenidoResumen = document.querySelector('#resumen .contenido');

let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  if (mesa === "" || hora === "") {
    mostrarAlerta("Todos los campos son Obligatorios");
    return;
  }

  //
  cliente = { ...cliente, mesa, hora };

  const modalFormulario = document.querySelector("#formulario");
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  mostrarSecciones();

  //Consultar API
  obtenerPlatillos();
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}

function obtenerPlatillos() {
  const url = `http://localhost:4000/platillos`;
  fetch(url)
    .then((respuesta) => respuesta.json() )
    .then( resultado => mostrarPlatillos(resultado) )
    .catch((error) => console.error(error) );
}

function mostrarPlatillos( platillos ) {

    platillos.forEach( platillo => {
        const {id, categoria, nombre, precio} = platillo;

        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombreDiv = document.createElement('div');
        nombreDiv.classList.add('col-md-4');
        nombreDiv.textContent = nombre;

        const precioDiv = document.createElement('div');
        precioDiv.classList.add('col-md-3', 'fw-bold');
        precioDiv.textContent = `S/ ${precio}`;

        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('col-md-3');
        categoriaDiv.textContent = categorias[categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${id}`;
        inputCantidad.classList.add('form-control');
        //Evento para el INPUT
        inputCantidad.onchange = function() {
            const cantidad = parseInt( inputCantidad.value );

            //convertir los valores en un solo objeto
            agregarPlatillo( {cantidad, ...platillo} );
            actualizarResumen();
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombreDiv);
        row.appendChild(precioDiv);
        row.appendChild(categoriaDiv);
        row.appendChild(agregar);
        contenidoPlatillo.appendChild(row);
    })
}

function agregarPlatillo( producto ) {
    //Extraer el pedido actual
    let { pedido } = cliente;

    //Comprobando que la cantidad del producto sea mayor a 1
    if (producto.cantidad > 0) {
        //Agregar al carrito
        if( !pedido.some( articulo => articulo.id === producto.id ) ) {
            cliente.pedido = [...pedido, producto]
            return;
        }

        //Actualizar la cantidad en caso se seleccione mas de 1 
        const pepidoActualizado = pedido.map( articulo => {
            if (articulo.id === producto.id) {
                articulo.cantidad = producto.cantidad;
            }
            return articulo;
        });
        cliente.pedido = [...pepidoActualizado];
        return;
    };

    //Eliminar producto
    const resultado = pedido.filter( articulo => articulo.id !== producto.id );
    cliente.pedido = [...resultado];
}

function actualizarResumen() {
    limpiarHtml(contenidoResumen);

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5','px-3', 'shadow');

    const mesa = document.createElement('p');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('span');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;

    const hora = document.createElement('p');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: ';

    const horaSpan = document.createElement('span');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;

    const titulo = document.createElement('h3');
    titulo.classList.add('my-4', 'text-center');
    titulo.textContent = 'Platillos Consumidos';

    //iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');
    
    cliente.pedido.forEach( articulo => {
        const { id, nombre, precio, categoria, cantidad} = articulo;

        //Scripting
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreLi = document.createElement('h4');
        nombreLi.classList.add('my-4');
        nombreLi.textContent = nombre;

        const cantidadLi = document.createElement('p');
        cantidadLi.classList.add('fw-bold');
        cantidadLi.textContent = `Cantidad: `;

        const cantidadSpan = document.createElement('span');
        cantidadSpan.classList.add('fw-normal');
        cantidadSpan.textContent = cantidad;

        const precioLi = document.createElement('p');
        precioLi.classList.add('fw-bold');
        precioLi.textContent = `Precio: S/ `;

        const precioSpan = document.createElement('span');
        precioSpan.classList.add('fw-normal');
        precioSpan.textContent = precio;

        const subtotalLi = document.createElement('p');
        subtotalLi.classList.add('fw-bold');
        subtotalLi.textContent = `SubTotal: S/ `;

        const subTotalSpan = document.createElement('span');
        subTotalSpan.classList.add('fw-normal');
        subTotalSpan.textContent = precio*cantidad;

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar Pedido';
        btnEliminar.onclick = function() {
            eliminarProducto( id );

            actualizarResumen();
        }

        //
        lista.appendChild(nombreLi);
        lista.appendChild(cantidadLi);
        lista.appendChild(precioLi);
        lista.appendChild(subtotalLi);
        lista.appendChild(btnEliminar);

        cantidadLi.appendChild(cantidadSpan);
        precioLi.appendChild(precioSpan);
        subtotalLi.appendChild(subTotalSpan);

        grupo.appendChild(lista);
    } )

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(titulo);
    
    resumen.appendChild(grupo);

    contenidoResumen.appendChild(resumen)
}

function eliminarProducto( id ) {
    //Eliminar producto
    let { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id );
    cliente.pedido = [...resultado];
}

function limpiarHtml( reference ) {
    while (reference.firstChild) {
        reference.removeChild( reference.firstChild )
    }
}

function mostrarAlerta(mensaje) {
  const alertaOld = document.querySelector(".invalid-feedback");

  if (!alertaOld) {
    const alerta = document.createElement("div");
    alerta.classList.add("invalid-feedback", "d-block", "text-center");
    alerta.textContent = mensaje;

    document.querySelector(".modal-body form").appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 2000);
  }
}
