{
    //Variables y Selectores
    const formulario = document.querySelector('#agregar-gasto');
    const gastoListado = document.querySelector('#gastos ul');

    //eventos
    eventosCall();
    function eventosCall() {
        document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
        formulario.addEventListener('submit', agregarGasto)
    }

    //clases
    class Presupuesto {
        constructor(presupuesto) {
            this.presupuesto = parseFloat(presupuesto);
            this.restante = parseFloat(presupuesto);
            this.gastos = [];
        }

        nuevoGasto( gasto ) {
            this.gastos = [...this.gastos, gasto];
            this.calcularRestante();
        }

        calcularRestante() {
            const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
            this.restante = this.presupuesto - gastado;
        }

        eliminarGasto( id ) {
            this.gastos = this.gastos.filter( gasto => gasto.id !== id)
            this.calcularRestante();
        }
    }   

    class UI {
        insertarPresupuesto(cantidad) {
            const {presupuesto, restante} = cantidad;
            document.querySelector('#total').textContent = presupuesto;
            document.querySelector('#restante').textContent = restante;
        }

        imprimirAlerta(mensaje, tipo) {
            const div = document.createElement('div');
            div.classList.add('text-center', 'alert');
            if (tipo === 'error') {
                div.classList.add('alert-danger')
            } else {
                div.classList.add('alert-success')
            }
            div.textContent= mensaje;

            document.querySelector('.primario').insertBefore(div, formulario);
            setTimeout(() => {
                div.remove();
            }, 2000);
        }

        agregarGastoListado( gastos ) {
            while ( gastoListado.firstChild) {
                gastoListado.removeChild(gastoListado.firstChild);
            }
            
            gastos.forEach( gasto => {
                const {nombre, cantidad, id} = gasto;
                //Crear li
                const nuevoGasto = document.createElement('li');
                nuevoGasto.classList = 'list-group-item d-flex justify-content-between align-items-center';
                nuevoGasto.dataset.id = id;
                
                //Agregar el HTML del gasto
                nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span>`;

                //Btn para borrar el gasto
                const btnBorrar = document.createElement('button');
                btnBorrar.classList = 'btn btn-danger borrar-gasto'
                btnBorrar.textContent = 'X';
                btnBorrar.onclick = () => {
                    eliminarGasto(id);
                }

                nuevoGasto.appendChild(btnBorrar);
                //Agregar al HTML
                gastoListado.appendChild(nuevoGasto);
            });
        }

        actualizarRestante( restante ) {
            document.querySelector('#restante').textContent = restante;
        }

        comprobarPresupuesto( presupuestoObj ) {
            const {presupuesto, restante } = presupuestoObj;
            const restanteDiv = document.querySelector('.restante');
            if ( (presupuesto / 4) > restante) {
                restanteDiv.classList.remove('alert-success');
                restanteDiv.classList.add('alert-danger');
            } else if( ( presupuesto / 2) > restante ) {
                restanteDiv.classList.remove('alert-success');
                restanteDiv.classList.add('alert-warning');
            } else {
                restanteDiv.classList.remove('alert-danger', 'alert-warning');
                restanteDiv.classList.add('alert-success');
            }

            if (restante <= 0) {
                formulario.querySelector('button[type="submit"]').disabled = true;
            }
        }
    }
    const ui = new UI();
    let presupuesto;

    //Funciones
    function preguntarPresupuesto() {
        const presupuestoUsuario = prompt('Cual es tu Presupuesto');

        if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario < 0) {
            window.location.reload();
        }

        presupuesto = new Presupuesto(presupuestoUsuario);
        ui.insertarPresupuesto( presupuesto );
    }

    function agregarGasto(e) {
        e.preventDefault();

        const inputGasto = document.querySelector('#gasto').value;
        const inputCantidad = parseFloat( document.querySelector('#cantidad').value );
        if (inputCantidad === '' || inputGasto === '') {
            ui.imprimirAlerta('todos los campos son obligatorios', 'error');
            return;
        }

        if (inputCantidad <= 0 || isNaN(inputCantidad)) {
            ui.imprimirAlerta('Cantidad no Válida', 'error');
            return;
        }

        const gasto = { nombre: inputGasto, cantidad: inputCantidad, id: Date.now() }
        //Añade un nuevo gasto
        presupuesto.nuevoGasto( gasto )

        ui.imprimirAlerta('Agregado correctamente');
        //Imprimir todos los gastos
        const { gastos, restante } = presupuesto;

        ui.agregarGastoListado(gastos);

        ui.actualizarRestante(restante);

        ui.comprobarPresupuesto( presupuesto );

        formulario.reset();
    }

    function eliminarGasto( id ) {
        presupuesto.eliminarGasto(id)
        ui.agregarGastoListado(presupuesto.gastos);

        ui.actualizarRestante(presupuesto.restante);

        ui.comprobarPresupuesto( presupuesto );
    }
}