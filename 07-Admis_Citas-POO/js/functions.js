import UI from './classes/Ui.js';
import Citas from './classes/Citas.js'
import { mascotaInput, propietarioInput, fechaInput, horaInput, telefonoInput, sintomasInput, formulario } from './selectores.js'

let editando = false;

const ui = new UI();
const administrarCitas = new Citas();

const citasObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//Asignar los calores en el objeto
export function datosCita(e) {
  if (e.target.value !== "") {
    citasObj[e.target.name] = e.target.value;
  }
}

export function nuevaCita(e) {
  e.preventDefault();

  const { mascota, propietario, telefono, fecha, hora, sintomas } = citasObj;
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.mostrarAlerta("todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    ui.mostrarAlerta("editado correcto");

    administrarCitas.editarCita({ ...citasObj });
    //Texto del boton luego de editar
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear Cita";
    //Quitar el modo edicion
    editando = false;
  } else {
    citasObj.id = Date.now();
    /* Para no reescribir el objeto anterior en el array */
    administrarCitas.agregarCita({ ...citasObj });
  }

  resetObject();
  formulario.reset();

  ui.mostarHtml(administrarCitas);
}

//Resetear los calores del objeto
export function resetObject() {
  citasObj.mascota = "";
  citasObj.propietario = "";
  citasObj.telefono = "";
  citasObj.fecha = "";
  citasObj.hora = "";
  citasObj.sintomas = "";
}

export function eliminarCita(id) {
  //Eliminar Cita
  administrarCitas.eliminarCita(id);
  //Mostar Mensaje
  ui.mostrarAlerta("la cita se elimino");
  //imprimir citas
  ui.mostarHtml(administrarCitas);
}

export function editarCita(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
  //HMTL
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;
  //Objeto
  citasObj.mascota = mascota;
  citasObj.propietario = propietario;
  citasObj.telefono = telefono;
  citasObj.fecha = fecha;
  citasObj.hora = hora;
  citasObj.sintomas = sintomas;
  citasObj.id = id;

  formulario.querySelector('button[type="submit"]').textContent =
    "actualizar Cita";

  editando = true;
}
