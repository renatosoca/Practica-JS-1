import { obtenerCliente, editarCliente } from './API.js';
import { mostrarAlerta, validarIncludes } from './funciones.js'

{
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const idHidden = document.querySelector('#id');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', async () => {
        const parametroURL = new URLSearchParams( window.location.search );
        const idURL = parseInt( parametroURL.get('id') );

        const cliente = await obtenerCliente(idURL);
        mostrarDatos(cliente);

        formulario.addEventListener('submit', validarCliente)
    });

    function mostrarDatos( cliente ) {
        const { id, nombre, email, telefono, empresa } = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
        idHidden.value = id;
    }

    function validarCliente( e ) {
        e.preventDefault();

        const cliente = { 
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: parseInt(idHidden.value)
        };

        if (validarIncludes(cliente)) {
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }
        
        editarCliente( cliente );
    }
}