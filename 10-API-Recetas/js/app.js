function iniciarApp() {
  const resultado = document.querySelector("#resultado");
  const favoritosDiv = document.querySelector(".favoritos");
  const selectCategoria = document.querySelector("#categorias");
  const modal = new bootstrap.Modal("#modal", {});

  if (selectCategoria) {
    selectCategoria.addEventListener("change", seleccionarCategoria);
    //Consultar API Recetas
    obtenerCategoria();
  }

  if (favoritosDiv) {
    //Consultar LocalStore
    obtenerFavoritos();
  }

  function obtenerCategoria() {
    try {
      const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
      fetch(url)
        .then((respuesta) => respuesta.json())
        .then((datos) => mostrarCategorias(datos));
    } catch (error) {
      console.error(error);
    }
  }

  function mostrarCategorias({ categories }) {
    categories.forEach((categoria) => {
      const { idCategory, strCategory } = categoria;

      //Scripting
      const option = document.createElement("option");
      option.dataset.id = idCategory;
      option.value = strCategory;
      option.textContent = strCategory;

      selectCategoria.appendChild(option);
    });
  }

  function seleccionarCategoria(e) {
    try {
      const categorie = e.target.value;
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorie}`;
      fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarProductos(resultado.meals));
    } catch (error) {
      console.error(error);
    }
  }

  function mostrarProductos( recetas = [] ) {
    limpiarHtml(resultado);

    const heading = document.createElement("h2");
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = recetas.length ? "Resultados" : "No hay Resultados";
    resultado.appendChild(heading);

    recetas.forEach( (producto) => {
      const { strMeal, strMealThumb, idMeal } = producto;

      //Scripting
      const recetaDiv = document.createElement("div");
      recetaDiv.classList.add("col-md-4");

      const recetaCard = document.createElement("div");
      recetaCard.classList.add("card", "mb-4");

      const recetaImg = document.createElement("img");
      recetaImg.classList.add("card-img-top");
      recetaImg.src = strMealThumb ?? producto.imagen;
      recetaImg.alt = strMeal;

      const recetaBody = document.createElement("div");
      recetaBody.classList.add("card-body");

      const recetaTitulo = document.createElement("h3");
      recetaTitulo.classList.add("card-title", "mb-3");
      recetaTitulo.textContent = strMeal ?? producto.nombre;

      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-danger", "w-100");
      btn.textContent = "Ver Receta";
      btn.onclick = function () {
        //Lo dejamos como CALLBACK
        mostrarReceta(idMeal ?? producto.id);
      };

      recetaBody.appendChild(recetaTitulo);
      recetaBody.appendChild(btn);
      recetaCard.appendChild(recetaImg);
      recetaCard.appendChild(recetaBody);
      recetaDiv.appendChild(recetaCard);

      resultado.appendChild(recetaDiv);
    });
  }

  function mostrarReceta(id) {
    try {
      const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      fetch(url)
        .then((resultado) => resultado.json())
        .then((respuesta) => mostrarDatosModal(respuesta));
    } catch (error) {
      console.error(error);
    }
  }

  function mostrarDatosModal({ meals }) {
    const { idMeal, strMeal, strInstructions, strMealThumb } = meals[0];

    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");
    const modalFooter = document.querySelector(".modal .modal-footer");

    //Scripting
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
        <img class="img-fluid" src="${strMealThumb}" alt="${strMeal}">
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3">Ingredientes y Cantidades</h3>
    `;

    const listGroup = document.createElement("ul");
    listGroup.classList.add("list-group");

    //Mostrar Ingredientes y cantidad
    for (let i = 1; i <= 20; i++) {
      if (meals[0][`strIngredient${i}`]) {
        const ingrediente = meals[0][`strIngredient${i}`];
        const cantidad = meals[0][`strMeasure${i}`];

        const ingredienteLi = document.createElement("li");
        ingredienteLi.classList.add("list-group-item");
        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

        listGroup.appendChild(ingredienteLi);
      }
    }
    modalBody.appendChild(listGroup);

    //Botones de agregar a FAVORITOS Y CERRAR MODAL
    limpiarHtml(modalFooter);
    const btnfavorito = document.createElement("button");
    btnfavorito.classList.add("btn", "btn-danger", "col");
    btnfavorito.textContent = existeStore(idMeal)
      ? "Eliminar Favorito"
      : "Guardar Favorito";
    btnfavorito.onclick = function () {
      //Eliminamos del LocalStore
      if (existeStore(idMeal)) {
        eliminarFavorito(idMeal);

        btnfavorito.textContent = "Guardar Favorito";

        mostarToast("Eliminado Correctamente");

        return;
      }

      //agregamos al LocalStore
      agregarFavorito({
        id: idMeal,
        nombre: strMeal,
        imagen: strMealThumb,
      });
      //Cambiar Estado del Boton
      btnfavorito.textContent = "Eliminar Favorito";
      mostarToast("Agregado Correctamente");
    };

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btn", "btn-secondary", "col");
    btnCerrar.textContent = "Cerrar Modal";
    btnCerrar.onclick = function () {
      modal.hide();
    };

    modalFooter.appendChild(btnfavorito);
    modalFooter.appendChild(btnCerrar);

    //Mostrar Modal
    modal.show();
  }

  function agregarFavorito(receta) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    localStorage.setItem("favoritos", JSON.stringify([...favoritos, receta]));
  }

  function eliminarFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    const nuevosFavoritos = favoritos.filter((favorito) => favorito.id !== id);
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
  }

  function existeStore(id) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    return favoritos.some((favorito) => favorito.id === id);
  }

  function mostarToast(mensaje) {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensaje;
    toast.show();
  }

  function limpiarHtml(reference) {
    while (reference.firstChild) {
      reference.removeChild(reference.firstChild);
    }
  }

  //Pagina Favoritos
  function obtenerFavoritos() {

    const favoritos = JSON.parse( localStorage.getItem( 'favoritos' ) ) ?? [];
    if (!favoritos.length) {
        const sinFavoritos = document.createElement('p');
        sinFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        sinFavoritos.textContent = 'No Favoritos Aún';
        resultado.appendChild(sinFavoritos)
        return;
    }

    mostrarProductos(favoritos);
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
