import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Form, Alert } from 'react-bootstrap'
import AlmacenarOperario from '../services/api/almacenarOperario'
import { ListaContext } from "../contexts/actualizarOperarios";

const AgregarOperarios = () => {
        const { actualizarLista } = useContext(ListaContext);

        const [mensajeExito, setMensajeExito] = useState("");
        useEffect(() => {
                if (mensajeExito) {
                  const timer = setTimeout(() => {
                    setMensajeExito("");
                  }, 2000);
              
                  return () => clearTimeout(timer);
                }
            }, [mensajeExito]);
            const nombreOperarioRef = useRef();
            const moduloRef = useRef();
            const formRef = useRef(null);

            const handleSubmit = async (e) => {
                e.preventDefault();
                const values = {
                    "nombreOperario": nombreOperarioRef.current.value,
                    "modulo": moduloRef.current.value
                };
                try {
                    const response = await AlmacenarOperario(values)
                    const modulo = 0;
                    await actualizarLista(modulo);
                    setMensajeExito("El operario se ha guardado correctamente");
                    formRef.current.reset();
                } catch (error) {
                    console.error("Ha ocurrido un error: ", error)
                }
            } 
        return (
            <Form className="m-5" style={{width: '100%'}} onSubmit={handleSubmit} ref={formRef}>
                {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}
                    <Form.Group className="m-5">
                        <Form.Label>Ingresa el nombre del operario</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" required ref={nombreOperarioRef}/>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Ingresa el modulo al cual pertenece</Form.Label>
                        <Form.Control type="text" placeholder="##" required ref={moduloRef}/>
                    </Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">Registrar operario</Button>
             </Form>
        )

}
export default AgregarOperarios