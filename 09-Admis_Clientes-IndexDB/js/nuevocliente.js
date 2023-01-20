{
    const formulario = document.querySelector('#formulario');
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', enviarForm);
    })

    function conectarDB() {
        const abrirconexion = window.indexedDB.open('crm', 1);

        abrirconexion.onerror = function() {
            console.log('Hubo un error');
        };

        abrirconexion.onsuccess = function() {
            DB = abrirconexion.result;
            console.log('creadaa')
        };
    }

    function enviarForm(e) {
        e.preventDefault();

        //Leer los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            alert('todos los campos son obligatorios');
            return;
        }
        //Crear objeto con la info
        const clienteObj = {
            nombre,
            email,
            telefono,
            empresa,
            id : Date.now()
        }
        
        crearNuevoCliente(clienteObj);

        formulario.reset();

        reinicarObj();
    }

    function crearNuevoCliente( cliente ) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');
        objStore.add(cliente);

        transaction.onerror = () => {console.log('Hubo error');};

        transaction.oncomplete = () => {
            console.log('cliente Agregado');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    function reinicarObj() {
        clienteObj.nombre = '';
        clienteObj.email = '';
        clienteObj.telefono = '';
        clienteObj.empresa = '';
        clienteObj.id = '';
    }
}