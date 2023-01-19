{
  const divCarrito = document.querySelector("#carrito");
  const bodyCarrito = document.querySelector("#tabla-carrito tbody");
  const btnLimpiarCarrito = document.querySelector("#vaciar-carrito");
  const liCursos = document.querySelector("#lista-cursos");

  let carrito = [];

  iniciarEventos();
  function iniciarEventos() {
    //Seleccionar el Curso
    liCursos.addEventListener("click", seleccionarCurso);

    divCarrito.addEventListener("click", borrarCurso);

    btnLimpiarCarrito.addEventListener("click", (e) => {
      e.preventDefault();
      carrito = [];
      mostrarHtml();
    });

    document.addEventListener('DOMContentLoaded', () => {
      carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      mostrarHtml();
    })
  }

  function seleccionarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
      const CursoSeleccionado = e.target.parentElement.parentElement;
      leerDatosCursos(CursoSeleccionado);
    }
  }

  function borrarCurso(e) {
    e.preventDefault();

    //Eliminar un curso del Carrito
    if (e.target.classList.contains("borrar-curso")) {
      const id = e.target.dataset.id;
      carrito = carrito.filter((curso) => curso.id !== id);
      mostrarHtml();
    }
  }

  function leerDatosCursos(curso) {
    const infCurso = {
      id: curso.querySelector("a").dataset.id,
      nombre: curso.querySelector("h4").textContent,
      imagen: curso.querySelector("img").src,
      precio: curso.querySelector("p span").textContent,
      cantidad: 1,
    };

    const existe = carrito.some((curso) => curso.id === infCurso.id); //true o false
    //Si no se esta duplicando el curso
    if (!existe) {
      carrito = [...carrito, infCurso];
      mostrarHtml();
      return;
    }

    //Si el curso se está duplicando, aumentar la cantidad
    const nuevoCarrito = carrito.map((curso) => {
      if (curso.id !== infCurso.id) {
        return curso;
      }
      //Si el curso dentro del arreglo ya alamacenado del carrito es igual al que estamos agregando, le agregamos la cantidad
      curso.cantidad++;
      return curso;
    });

    carrito = [...nuevoCarrito];
    mostrarHtml();
  }

  function mostrarHtml() {
    limpiarHtml();

    carrito.forEach((curso) => {
      const { id, nombre, imagen, precio, cantidad } = curso;

      const row = document.createElement("tr");
      row.innerHTML = `
            <td><img src="${imagen}"></td>
            <td><p>${nombre}</p></td>
            <td><p>${precio}</p></td>
            <td><p>${cantidad}</p></td>
            <td><a href="#" class="borrar-curso" data-id="${id}">x</a></td>
      `;

      bodyCarrito.appendChild(row);
    });

    sincronizarStore();
  }

  //Agregar al LocalStore
  function sincronizarStore() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarHtml();
  }

  function limpiarHtml() {
    while (bodyCarrito.firstChild) {
      bodyCarrito.removeChild(bodyCarrito.firstChild);
    }
  }
}
