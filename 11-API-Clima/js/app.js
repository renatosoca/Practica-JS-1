{
  const formulario = document.querySelector("#formulario");
  const resultado = document.querySelector("#resultado");
  const container = document.querySelector(".container");

  window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
  });

  function buscarClima(e) {
    e.preventDefault();
    const ciudadInput = document.querySelector("#ciudad").value;
    const paisInput = document.querySelector("#pais").value;

    //Validar
    if (ciudadInput === "" || paisInput === "") {
      alert("llenar todos los campos");
      return;
    }

    consultarAPI(ciudadInput, paisInput);
  }

  async function consultarAPI(ciudad, pais) {
    const key = "32645c0cf3355ad76d9179394dcdf2cc";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${key}`;

    spinner();

    try {
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      
      limpiarHTML();  //Importante limpiar el Html previo
          
      if (resultado.cod === "404") {
        alert("Clima no encontrado");
        return;
      }

      mostrarClima(resultado);
    } catch (error) {
      console.error(error)
    }
  }

  function mostrarClima(datos) {
    const {
      name,
      main: { temp, temp_max, temp_min },
    } = datos;
    const centigrados = parseInt(temp - 273.15);
    const max = parseInt(temp_max - 273.15);
    const min = parseInt(temp_min - 273.15);

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451`;
    actual.classList.add("font-bold", "text-6xl");

    const nombre = document.createElement("p");
    nombre.textContent = `Clima en ${name}`;
    nombre.classList.add("font-bold", "text-2xl");

    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = `Max: ${max} &#8451`;
    tempMaxima.classList.add("text-xl");

    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    tempMinima.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-while");

    resultadoDiv.appendChild(nombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultado.appendChild(resultadoDiv);
  }

  function limpiarHTML() {
    while (resultado.firstChild) {
      resultado.removeChild(resultado.firstChild);
    }
  }

  function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement("div");
    divSpinner.classList.add("spinner");

    resultado.appendChild(divSpinner);
  }
}
