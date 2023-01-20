function iniciarApp() {
    //Variables
    const formulario = document.querySelector('#formulario');
    const resultado = document.querySelector('#resultado');
    const paginacion = document.querySelector('#paginacion');

    const registrosPorPagina = 30;
    let totalPaginas
    let iterador;
    let paginaActual = 1;

    //Eventos
    formulario.addEventListener('submit', obtenerImagenes)

    //Funciones
    async function obtenerImagenes(e) {
        e.preventDefault();
        const inputTermino = document.querySelector('#termino').value;

        if (inputTermino === '') {
            alert('Termino Obligatorio');
            return;
        }   //Fin del if

        const key = '32953648-97943c7707fe699be13cc4048'
        const url = `https://pixabay.com/api/?key=${key}&q=${inputTermino}&image_type=photo&pretty=true&per_page=${registrosPorPagina}&page=${paginaActual}`;
        
        spinner();

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json()
    
            limpiarHtml(resultado);

            totalPaginas = cantidadPaginas(resultado.totalHits);
            
            mostrarImagenes(resultado.hits)
        } catch (error) {
            console.error(error);
        }
    }   //Fin Obtener Imagenes

    //Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
    function *crearPaginador( total ) {
        for (let i = 1; i <= total; i++) {
            yield i;
        }
    }   //Fin del Generador

    function mostrarImagenes( imagenes ) {
        limpiarHtml(resultado);

        imagenes.forEach( imagen => {
            const {id, previewURL, likes, views, largeImageURL} = imagen;

            resultado.innerHTML += `
                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <div class="bg-white">
                        <img class="w-full" src="${previewURL}" >

                        <div class="p-4">
                            <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                            <p class="font-bold">${views} <span class="font-light">Veces vistas</span></p>

                            <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="block w-full bg-blue-800 hover:bg-blue-600 text-white uppercase font-bold text-center rounded p-1 mt-5">Ver imagen</a>
                        </div>
                    </div>
                </div>
            `;
        }); //Fin foreach
        limpiarHtml(paginacion);

        imprimirPaginador();
    }   //Fin mostrar Imagenes

    function cantidadPaginas( total ) {
        return parseInt(Math.ceil( total / registrosPorPagina));
    }

    function limpiarHtml( refence ) {
        while (refence.firstChild) {
            refence.removeChild( refence.firstChild );
        }
    }

    function imprimirPaginador() {
        limpiarHtml(paginacion);

        iterador = crearPaginador( totalPaginas );
        while (true) {
            const {done, value} = iterador.next();
            if (done) return;

            //Mostrar los botenes
            const btn = document.createElement('a');
            btn.href = '#';
            btn.dataset.pagina = value;
            btn.textContent = value;
            btn.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'uppercase', 'rounded');
            btn.onclick = function(e) {
                paginaActual = value

                obtenerImagenes(e);
            }

            paginacion.appendChild( btn )
        }
    }

    function spinner() {
        limpiarHtml(resultado);

        const spinnerDiv = document.createElement('div');
        spinnerDiv.classList.add('spinner');
        spinnerDiv.innerHTML = `
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        `;

        resultado.appendChild(spinnerDiv);
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp)