import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Alert, ButtonGroup, Col, Row } from 'react-bootstrap'
import AlmacenarDatos from '../services/api/almacenarRegistroOperaciones'
import { ListaContext as ContextoEnLista} from "../contexts/actualizarRegistroOperaciones";
import { ListaContext, ListaProvider } from '../contexts/actualizarOperarios';

const RegistrarOperaciones = () => {
    const { lista, actualizarLista } = React.useContext(ListaContext);
    const { setListaRegistro } = React.useContext(ContextoEnLista);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [botonSeleccionado, setBotonSeleccionado] = useState(null);
        useEffect(() => {
                if (mensajeExito || mensajeError) {
                  const timer = setTimeout(() => {
                    setMensajeExito("");
                    setMensajeError("")
                  }, 3000);
              
                  return () => clearTimeout(timer);
                }
            }, [mensajeExito, mensajeError]);
            
            const operarioRef = useRef();
            const unidadesProducidasRef = useRef();
            const formRef = useRef(null);
             const handleButtonClick = async (modulo, index) => {
                setBotonSeleccionado(index);
        try {
            await actualizarLista(modulo);
        } catch (error) {
            console.error("Ha ocurrido un error: ", error)
        }
    }
            const handleSubmit = async (e) => {
                e.preventDefault();
                const values = {
                    "operario": operarioRef.current.value,
                    "unidadesProducidas": unidadesProducidasRef.current.value
                };
                try {
                    await AlmacenarDatos(values)
                    await setListaRegistro();
                   setMensajeExito("El registro se ha guardado correctamente");
                   formRef.current.reset();
                } catch (error) {
                    setMensajeError("Ha ocurrido un error, por favor intente de nuevo mas tarde");
                    console.error("Ha ocurrido un error: ", error)
                }
            } 
        /* CONFIGURACION BOTONES */
        const botones = [
            { label: 'Módulo 1', value: 1 },
            { label: 'Módulo 2', value: 2 },
            { label: 'Módulo 3', value: 3 },
            { label: 'Módulo 4', value: 4 }
          ];
        /* ------------------------- */
        return (
            <Col className="formularioConBotones">
                <ListaProvider>
                            <ButtonGroup>
                                {botones.map((boton, index) => (
                                <Button key={index} variant={botonSeleccionado === index ? 'primary' : 'secondary'} onClick={() => handleButtonClick(boton.value, index)}>{boton.label}</Button>
                                ))}
                            </ButtonGroup>
                <Form className="m-5" style={{width: '100%'}} onSubmit={handleSubmit} ref={formRef}>
                {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}
                {mensajeError && <Alert variant="warning">{mensajeError}</Alert>}
                    <Form.Group className="m-5"> 
                        <Form.Label>Seleccione el operario</Form.Label>
                        <Form.Select required ref={operarioRef}>
                            {lista.map((dato, index) => (
                                <option value={dato.op_id}>{dato.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Ingrese las unidades producidas</Form.Label>
                        <Form.Control type="number" placeholder="##" required ref={unidadesProducidasRef}/>
                    </Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">Registrar Operación</Button>
             </Form>
             </ListaProvider>
            </Col>
            
        )

}
export default RegistrarOperaciones
