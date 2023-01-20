const monedaSelect = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda();

    formulario.addEventListener('submit', enviarFormulario);
    
    monedaSelect.addEventListener('change', leerDatos);
    criptomonedaSelect.addEventListener('change', leerDatos);
})

//Promise
const obtenerCriptomoneda = criptomonedas => new Promise( resolve => {
    resolve( criptomonedas );
});

async function consultarCriptomoneda() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomoneda(resultado.Data);
        selectCriptomoneda(criptomonedas );
    } catch (error) {
        console.error(error)
    }
}

function selectCriptomoneda( criptomonedas ) {
    criptomonedas.forEach( cripto => {
        const {CoinInfo: {FullName, Name}} = cripto;
        
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        
        criptomonedaSelect.appendChild(option);
    });
}

function enviarFormulario(e) {
    e.preventDefault();

    if( Object.values(objBusqueda).includes('') ) {
        alert('Todos los campos son obligatorios');
        return;
    }

    consultarAPI();
}

function leerDatos(e) {
    objBusqueda[e.target.name] = e.target.value;
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    spinner();

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        
        mostrarResultado( resultado.DISPLAY[criptomoneda][moneda] );
    } catch (error) {
        console.error(error);
    }
}

function mostrarResultado( cotizacion ) {
    limpiarHtml(resultado);

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es:<span> ${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio más alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio más bajo del dia: <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación ultimas 24horas: <span>${CHANGEPCT24HOUR} %</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml( reference ) {
    while (reference.firstChild) {
        reference.removeChild( reference.firstChild);
    }
}

function spinner() {
    limpiarHtml(resultado);

    const spinner = document.createElement('div');
    spinner.classList.add('sk-chase');
    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(spinner);
}