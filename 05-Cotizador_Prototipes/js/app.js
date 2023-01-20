{
    //Constructores
    function Seguro(marca, year, tipo) {
        this.marca = marca;
        this.year = year;
        this.tipo = tipo;
    }

    Seguro.prototype.cotizar = function() {
        let cantidad;
        const base = 2000;
        switch (this.marca) {
            case '1':
                cantidad = base * 1.15
                break;
            case '2':
                cantidad = base * 1.05;
                break;
            case '3':
                cantidad = base * 1.35;
                break;
            default:
                break;
        }
        //Leer el año
        const diferencia = new Date().getFullYear() - this.year
        cantidad -= ((diferencia * 3) * cantidad) / 100

        if (this.tipo === 'basico') {
            cantidad *= 1.30;
        } else {
            cantidad *= 1.50;
        }
        return cantidad;
    }

    function UI() {}

    //Llena las opciones de los años
    UI.prototype.llenarOpciones = () => {
        const max = new Date().getFullYear();
        const min = max - 20;

        const selectYear = document.querySelector('#year');

        for (let i = max; i > min ; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectYear.appendChild(option);
        }
    }

    UI.prototype.mostrarMensaje = (mensaje, tipo) => {
        const alerta = document.createElement('p');
        if ( tipo === 'error') {
            alerta.classList.add('error')
        } else {
            alerta.classList.add('correcto')
        }
        alerta.classList.add('mensaje', 'mt-10');
        alerta.textContent = mensaje;
        const formulario = document.querySelector('#cotizar-seguro');
        formulario.insertBefore(alerta, document.querySelector('#resultado'));
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    UI.prototype.mostrarResultado = (seguro, total) => {
        const {marca, year, tipo } = seguro

        const div = document.createElement('div');
        div.classList.add('mt-10');
        div.innerHTML = `
            <p class="header" > Tu resumen</p>
            <p class="font-bold" > Marca : ${marca}</p>
            <p class="font-bold" > Año: ${year}</p>
            <p class="font-bold" > Tipo: ${tipo}</p>
            <p class="font-bold" >Total: ${total}</p>
        `;

        const resultado = document.querySelector('#resultado');

        const spinner = document.querySelector('#cargando');
        spinner.style.display = 'block';
        setTimeout(() => {
            spinner.style.display = 'none';
            resultado.appendChild(div);
        }, 3000);
    }

    //instanciar UI
    const ui = new UI();

    document.addEventListener('DOMContentLoaded', () => {
        ui.llenarOpciones();
    })

    eventlistener();
    function eventlistener() {
        const formulario = document.querySelector('#cotizar-seguro');
        formulario.addEventListener('submit', cotizarSeguro)
    }

    function cotizarSeguro(e) {
        e.preventDefault();
        //Marca seleccionada
        const marca = document.querySelector('#marca').value;
        //Año seleccionado
        const year = document.querySelector('#year').value
        //Cobertura seleccionada
        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        if (marca === '' || year === '' || tipo === '') {
            ui.mostrarMensaje('Todos los campos son obligatorio', 'error');
            return;
        }

        const resultado = document.querySelector('#resultado div');
        if (resultado != null) {
            resultado.remove();
        }
        
        //Instanciando el seguro
        const seguro = new Seguro(marca, year, tipo);
        const total = seguro.cotizar();

        //Prototipe que va a cotizar 
        ui.mostrarResultado(seguro, total);
    }
}