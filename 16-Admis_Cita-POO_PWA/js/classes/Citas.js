class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita( cita ) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita( id) {
        this.citas = this.citas.filter( cita => cita.id !== id );
    }

    editarCita( citaEdit ) {
        this.citas = this.citas.map( cita => cita.id === citaEdit.id ? citaEdit : cita )
    }
}

export default Citas;