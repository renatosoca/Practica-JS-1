export function mostrarAlerta( mensaje ) {
    const alerta = document.querySelector('.bg-red-100')
    if (!alerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-100', 'text-red-700', 'rounded', 'px-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong Class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        const formulario = document.querySelector('#formulario');
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }
}

export function validarIncludes( obj ) {
    return Object.values( obj ).includes('');
}

export function validarEvery( obj ) {
    return !Object.values( obj ).every( input => input !== '' );
}