if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then( respuesta => console.log('Se instaló..', respuesta) )
        .catch( error => console.log('Fallo de instalacion...', error) )
} else {
    console.log('Service Worker no soportado');
}