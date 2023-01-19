{
    const marca = document.querySelector('#marca');
    const year = document.querySelector('#year');
    const minimo = document.querySelector('#minimo');
    const maximo = document.querySelector('#maximo');
    const puertas = document.querySelector('#puertas');
    const transmision = document.querySelector('#transmision');
    const color = document.querySelector('#color');

    const divresultado = document.querySelector('#resultado');
    const max = new Date().getFullYear();
    const min = max - 14;

    const datosBusqueda = {
        marca: '',
        year: '',
        minimo: '',
        maximo: '',
        puertas: '',
        transmision: '',
        color: ''
    }

    document.addEventListener('DOMContentLoaded', () => {
        mostrarAutos(autos);

        llenarSelect();
    });

    marca.addEventListener('change', e => {
        datosBusqueda.marca = e.target.value
        filtrarAuto();

    })
    year.addEventListener('change', e => {
        datosBusqueda.year = parseInt( e.target.value )
        filtrarAuto();
    })
    minimo.addEventListener('change', e => {
        datosBusqueda.minimo = e.target.value
        filtrarAuto();
    })
    maximo.addEventListener('change', e => {
        datosBusqueda.maximo = e.target.value
        filtrarAuto();
    })
    puertas.addEventListener('change', e => {
        datosBusqueda.puertas = parseInt( e.target.value )
        filtrarAuto();
    })
    transmision.addEventListener('change', e => {
        datosBusqueda.transmision = e.target.value
        filtrarAuto();
    })
    color.addEventListener('change', e => {
        datosBusqueda.color = e.target.value
        filtrarAuto();
    })

    function mostrarAutos(autos) {
        limpiarHTML()
        autos.forEach( auto => {
            const {marca, modelo, year, puertas, transmision, precio, color} = auto
            const autoHTML = document.createElement('p');

            autoHTML.textContent = `${marca} ${modelo} - ${year} - Puertas: ${puertas} - Transmision: ${transmision} - Precio: ${precio} - Color: ${color}`

            divresultado.appendChild(autoHTML);
        })
    }

    function limpiarHTML() {
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild)
        }
    }

    function llenarSelect() {

        for (let i = max; i > min; i--) {
            const options = document.createElement('option');
            options.value = i
            options.textContent = i;
            year.appendChild(options)
        }
    }

    function filtrarAuto() {
        const resultado = autos.filter( FiltrarMarca ).filter( filtarYear ).filter( filtrarMinimo ).filter( filtrarMaximo).filter( filtrarPuertas ).filter( filtrarTransmision ).filter( filtrarColor )

        if (!resultado.length) {
            limpiarHTML();

            const noAlerta = document.createElement('div');
            noAlerta.classList.add('alerta', 'error');
            noAlerta.textContent = "Sin resultado";
            divresultado.appendChild(noAlerta);
            return
        }

        mostrarAutos(resultado);
    }

    function FiltrarMarca( auto ) {
        if (datosBusqueda.marca) {
            return auto.marca === datosBusqueda.marca
        }
        return auto;
    }

    function filtarYear( auto ) {
        if (datosBusqueda.year) {
            return auto.year === datosBusqueda.year
        }
        return auto;
    }

    function filtrarMinimo( auto ) {
        if (datosBusqueda.minimo) {
            return auto.precio >= datosBusqueda.minimo
        }
        return auto;
    }

    function filtrarMaximo( auto ) {
        if (datosBusqueda.maximo) {
            return auto.precio <= datosBusqueda.maximo
        }
        return auto;
    }

    function filtrarPuertas( auto ) {
        if (datosBusqueda.puertas) {
            return auto.puertas === datosBusqueda.puertas
        }
        return auto;
    }

    function filtrarTransmision( auto ) {
        if (datosBusqueda.transmision) {
            return auto.transmision === datosBusqueda.transmision
        }
        return auto;
    }

    function filtrarColor( auto ) {
        if (datosBusqueda.color) {
            return auto.color === datosBusqueda.color
        }
        return auto;
    }
}