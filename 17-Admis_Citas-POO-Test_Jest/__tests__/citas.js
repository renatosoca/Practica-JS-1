import Citas from '../js/classes/Citas';

describe('Probar clase de Citas', () => {
    const citas = new Citas();
    const id = Date.now();

    test('Agregar nueva Cita', () => { 
        const citasObj = {
            id,
            mascota: 'Minina',
            propietario: 'Renato',
            telefono: '123456789',
            fecha: '21-01-2023',
            hora: '23:36',
            sintomas: 'Inquieta'
        };

        citas.agregarCita(citasObj);

        //Prueba
        expect(citas).toMatchSnapshot();
    });

    test('Actualizar Cita', () => { 
        const citasObj = {
            id,
            mascota: 'Nueva minina',
            propietario: 'Renato',
            telefono: '123456789',
            fecha: '21-01-2023',
            hora: '23:36',
            sintomas: 'Inquieta'
        };

        citas.editarCita(citasObj);

        //Prueba
        expect(citas).toMatchSnapshot();
    })

    test('Eliminar Cita', () => {

        citas.eliminarCita( id );

        //Prueba
        expect(citas).toMatchSnapshot();
    })
})