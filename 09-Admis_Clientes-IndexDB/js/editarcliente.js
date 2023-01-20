{
    let DB;
    let idCliente;
    
        //Leer los inputs
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', editarCliente);

        //Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 400);
        }
    }) 

    function obtenerCliente( id ) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            
            if (cursor) {
                if ( cursor.value.id === Number(id)) {
                    llenarFormulario( cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario( cliente ) {
        const {nombre, email, telefono, empresa } = cliente;
        nombreInput.value = nombre; 
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function editarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            alert('todos los campos son obligatorios');
            return;
        }

        //Actualizar Cliente
        const clienteObj = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');
        
        objStore.put(clienteObj);

        transaction.onerror = (e) => {console.log(e);};

        transaction.oncomplete = () => {
            console.log('cliente editado');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    function conectarDB() {
        const abrirconexion = window.indexedDB.open('crm', 1);

        abrirconexion.onerror = function() {
            console.log('Hubo un error');
        };

        abrirconexion.onsuccess = function() {
            DB = abrirconexion.result;
        };
    }
}