import { datosCita, nuevaCita } from '../functions.js';
import { mascotaInput, propietarioInput, fechaInput, horaInput, telefonoInput, sintomasInput, formulario } from '../selectores.js'

class App {

    constructor() {
        this.initApp();
    }

    initApp() {
        mascotaInput.addEventListener('input', datosCita);
        propietarioInput.addEventListener('input', datosCita);
        telefonoInput.addEventListener('input', datosCita);
        fechaInput.addEventListener('input', datosCita);
        horaInput.addEventListener('input', datosCita);
        sintomasInput.addEventListener('input', datosCita);

        formulario.addEventListener('submit', nuevaCita)
    }
}

export default App;