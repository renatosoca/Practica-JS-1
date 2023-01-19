{
    document.addEventListener('DOMContentLoaded', () => {

        const inputEmail = document.querySelector('#email');
        const inputAsunto = document.querySelector('#asunto');
        const inputMensaje = document.querySelector('#mensaje');
        const formulario = document.querySelector('#formulario');
        const btnSubmit = document.querySelector('#formulario button[type="submit"]');
        const btnReset = document.querySelector('#formulario button[type="reset"]');
        const spinner = document.querySelector('#spinner');
        
        const email = {
            email:'',
            asunto: '',
            mensaje: ''
        }

        //Cuando sales del input
        inputEmail.addEventListener('input', validar)
        inputAsunto.addEventListener('blur', validar)
        //Cuando escribes en el input
        inputMensaje.addEventListener('input', validar)

        formulario.addEventListener('submit', enviarEmail)

        btnReset.addEventListener('click', e => {
            e.preventDefault();

            email.email = '';
            email.asunto = '';
            email.mensaje = '';
            habilitarEnvio();
            formulario.reset();
        })

        function validar(e) {
            if (e.target.value.trim() === '') {
                mostrarAlerta(e.target.parentElement);
                email[e.target.id] = '';
                habilitarEnvio();
                return;
            }
            if( e.target.id === 'email' && !validarEmail(e.target.value) ) {
                mostrarAlerta(e.target.parentElement);
                email[e.target.id] = '';
                habilitarEnvio();
                return;
            }
            limpiarAlerta(e.target.parentElement);

            email[e.target.id] = e.target.value;
            habilitarEnvio();
        }

        function mostrarAlerta(referencia) {
            limpiarAlerta(referencia);

            const alert = document.createElement('i');
            alert.classList.add('fa-solid', 'fa-circle-exclamation', 'text-red');
            referencia.appendChild(alert);
        }

        function limpiarAlerta(referencia) {
            const alertaPrevia = referencia.querySelector('.fa-circle-exclamation');
            if (alertaPrevia) {
                alertaPrevia.remove();  
            }
        }

        function validarEmail(email) {
            const raw = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            const resultado = raw.test(email)
            return resultado;
        }

        function habilitarEnvio() {

            if ( !Object.values(email).includes('') ) {
                btnSubmit.classList.remove('opacity-50');
                btnSubmit.disabled = false
                return
            }
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true
        }

        function enviarEmail(e) {
            e.preventDefault();

            spinner.classList.remove('hidden');

            setTimeout(() => {
                spinner.classList.add('hidden');

                email.email = '';
                email.asunto = '';
                email.mensaje = '';
                habilitarEnvio();
                formulario.reset(); 
                
                //Alerta de Exito
                const alertaExito = document.createElement('p');
                alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase');
                alertaExito.textContent = 'Mensaje Enviado Correctamente',
                formulario.appendChild(alertaExito);
            }, 3000);
        }
    });
}