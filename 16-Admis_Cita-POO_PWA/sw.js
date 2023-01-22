//Se hace cambios cuando hacemos actualización en el proyecto
const nombreCache = 'apv-v4';
const archivos = [
    './',
    './index.html',
    './error.html',
    './css/bootstrap.css',
    './css/styles.css',
    './js/app.js',
    './js/classes/App.js',
    './js/classes/Citas.js',
    './js/classes/Ui.js',
    './js/functions.js',
    './js/selectores.js',
    './js/apv.js',
    './manifest.json',
    './sw.js'
]


//INSTALAR EL SERVICE WORKER
self.addEventListener('install', e => {
    console.log('Instalando el Service Worker..');

    //espera hasta que se recargen todos los archivos de cache
    e.waitUntil(
        caches.open( nombreCache )
            .then( cache => {
                console.log('cacheando');
                cache.addAll( archivos );
                console.log('cacheado');
            })
    )
    console.log('instalado');
});

//ACTIVAR EL SERVICE WORKER
self.addEventListener('activate', e => {
    console.log('Service Worker Activando...');
    
    e.waitUntil(
        caches.keys()
            .then(keys => {
                console.log(keys);
                return Promise.all(
                    keys.filter( key => key !== nombreCache )
                        .map( key => caches.delete(key) ) //Borrar las versiones anteriores
                )
            })
    )
})

//PARA INSTALAR NUESTRA APLICACION EN EL CELULAR, DESKTOP, ETC
self.addEventListener('fetch', e => {
    console.log('FETCHH...', e);
    
    e.respondWith(
        (async function () {
            try {
                const cachedResponse = await caches.match(e.request);
                if (cachedResponse)  return cachedResponse ?? caches.match( './error.html' ); 
                return fetch(e.request) ?? caches.match( './error.html' );
            } catch (error) {
                console.log(error);
            }
        })()    // <-- Importante estos paréntesis finales!!
    );
})