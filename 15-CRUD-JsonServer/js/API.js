const url = `http://localhost:4000/clientes`;

//Agregar nuevo Cliente
export const nuevoCliente = async cliente => {
    try {
        const respuesta = await fetch( url, {
            method: 'POST',
            body: JSON.stringify( cliente ),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
    }
}

//Listado de los Clientes
export const obtenerClientes = async () => {
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error(error);
    }
}

//Eliminar Cliente
export const eliminarCliente = async id => {
    try {
        const respuesta = fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
        console.log(respuesta);
    } catch (error) {
        console.error(error);
    }
}

//Extraer datos especificos de un clientes
export const obtenerCliente = async id => {
    try {
        const respuesta = await fetch(`${url}/${id}` );
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error(error);
    }
}

//Editar Cliente
export const editarCliente = async cliente => {
    try {
        const respuesta = await fetch(`${url}/${cliente.id}`, {
            method: 'PUT',
            body: JSON.stringify( cliente ),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        window.location.href = 'index.html'
    } catch (error) {
        console.error(error);
    }
}