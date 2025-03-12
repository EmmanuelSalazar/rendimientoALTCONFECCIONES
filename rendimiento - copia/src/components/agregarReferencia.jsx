import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap'
import AlmacenarDatos from '../services/api/almacenarReferencia'
import { ListaContext } from '../contexts/actualizarReferencias';
const AgregarReferencia = () => {
    const { actualizarLista } = React.useContext(ListaContext);
    const [mensajeExito, setMensajeExito] = useState("");
    useEffect(() => {
        if (mensajeExito) {
          const timer = setTimeout(() => {
            setMensajeExito("");
          }, 2000);
          return () => clearTimeout(timer);
        }
      }, [mensajeExito]);

    const codigoReferenciaRef = useRef();
    const tiempoTareaRef = useRef();
    const moduloRef = useRef();
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const codigoReferencia = codigoReferenciaRef.current.value;
        const tiempoTarea = tiempoTareaRef.current.value;
        const modulo = moduloRef.current.value;

        const values = {
            'codigoReferencia': codigoReferencia,
            'tiempoTarea': tiempoTarea,
            'modulo': modulo,
        }
        try {
            await AlmacenarDatos(values)
            await actualizarLista();
            setMensajeExito("La Referencia se ha almacenado correctamente");
            formRef.current.reset();
        } catch (error){
            setMensajeExito("Ha ocurrido un error, si este persiste, contacte con el administrador");
            console.error("Ha ocurrido un error: ", error)

        }
        
    }
    return (
            <Form className="m-5" style={{width: '100%'}} onSubmit={handleSubmit} ref={formRef}>
                                    {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el codigo de referencia</Form.Label>
                    <Form.Control type="text" placeholder="Ej: 12345" required ref={codigoReferenciaRef}/>
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el tiempo de esta tarea</Form.Label>
                    <Form.Control type="number" placeholder="Tiempo en minutos" required ref={tiempoTareaRef} step="any"/>
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Ingresa el modulo al cual pertenece</Form.Label>
                    <Form.Control type="number" placeholder="Ej: 1" required ref={moduloRef}/>
                </Form.Group>
                <Button className="mx-5" variant="primary" type="submit">Registrar referencia</Button>
            </Form>
    )
}
export default AgregarReferencia