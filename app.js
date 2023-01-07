{
  const divCarrito = document.querySelector("#carrito");
  const bodyCarrito = document.querySelector("#lista-carrito tbody");
  const btnLimpiarCarrito = document.querySelector('#vaciar-carrito')
  const liCursos = document.querySelector("#lista-cursos");

  let carrito = [];

  iniciarEventos();
  function iniciarEventos() {
    //Seleccionar el Curso
    liCursos.addEventListener("click", seleccionarCurso);
  }

  function seleccionarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const CursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCursos(CursoSeleccionado)
    }
  }

  function leerDatosCursos( curso ) {
    const infCurso = {
        id: curso.querySelector('a').dataset.id,
        nombre: curso.querySelector('h4').textContent,
        imagen: curso.querySelector('img').src,
        precio: curso.querySelector('p span').textContent,
        cantidad: 1
    }
    
    const carrito = [...carrito, infCurso]
    console.log(carrito);
  }

}
