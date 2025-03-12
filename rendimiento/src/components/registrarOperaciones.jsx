import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Alert, Col, Stack } from 'react-bootstrap'
import { Switch } from "antd";
import AlmacenarDatos from '../services/api/almacenarRegistroOperaciones'
import { ListaContext as ContextoEnLista} from "../contexts/actualizarRegistroOperaciones";
import { ListaContext, ListaProvider } from '../contexts/actualizarOperarios';
import { ListaContext as ContextoEnLista2} from "../contexts/actualizarReferencias";
const RegistrarOperaciones = () => {
    const { lista, actualizarLista } = React.useContext(ListaContext);
    const { listas } = React.useContext(ContextoEnLista2);
    const { setListaRegistro } = React.useContext(ContextoEnLista);
    const [mensajeExito, setMensajeExito] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [registroMultiple, setRegistroMultiple] = useState(true);
    const operarioRef = useRef();
    const unidadesProducidasRef = useRef();
    const referenciaRef = useRef();
    const formRef = useRef(null);
        useEffect(() => {
                if (mensajeExito || mensajeError) {
                  const timer = setTimeout(() => {
                    setMensajeExito("");
                    setMensajeError("")
                  }, 3000);
              
                  return () => clearTimeout(timer);
                }
            }, [mensajeExito, mensajeError]);
            // ACTIVAR/DESACTIVAR REGISTROS MULTIPLES
            const activarRegistroMultiple = async (valor) => {
                if (valor == false) {
                    setRegistroMultiple(true)
                    try {
                        await actualizarLista(window.moduloSeleccionado, registroMultiple);
                    } catch (error) {
                        setMensajeError("Ha ocurrido un error: ", error)
                    }
                } else if (valor == true) {
                    setRegistroMultiple(false)
                    try {
                        await actualizarLista(window.moduloSeleccionado, registroMultiple);
                    } catch (error) {
                        setMensajeError("Ha ocurrido un error: ", error)
                    }
                }
                console.log(valor)
            }
            const handleSubmit = async (e) => {
                e.preventDefault();
                const values = {
                    "operario": operarioRef.current.value,
                    "unidadesProducidas": unidadesProducidasRef.current.value,
                    "referencia" : referenciaRef.current.value
                };
                try {   
                    await AlmacenarDatos(values)
                    await setListaRegistro(window.moduloSeleccionado);
                    await actualizarLista(window.moduloSeleccionado, registroMultiple);
                   setMensajeExito("El registro se ha guardado correctamente");
                   formRef.current.reset();
                } catch (error) {
                    setMensajeError("Ha ocurrido un error, por favor intente de nuevo mas tarde");
                    console.error("Ha ocurrido un error: ", error)
                }
            } 
        return (
            <Col className="formularioConBotones">
                <ListaProvider>
                <Form className="mx-5" style={{width: '100%'}} onSubmit={handleSubmit} ref={formRef}>
                {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}
                {mensajeError && <Alert variant="warning">{mensajeError}</Alert>}
                    <Form.Group className="mx-5"> 
                        <Form.Label>Seleccione el operario</Form.Label>
                        <Form.Select required ref={operarioRef}>
                            {lista.map((dato, index) => (
                                <option value={dato.op_id}>{dato.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-5"> 
                        <Form.Label>Seleccione la referencia</Form.Label>
                        <Form.Select required ref={referenciaRef}>
                            {listas.map((dato, index) => (
                                <option value={dato.ref_id}>{dato.referencia}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="m-5">
                        <Form.Label>Ingrese las unidades producidas</Form.Label>
                        <Form.Control type="number" placeholder="##" required ref={unidadesProducidasRef}/>
                    </Form.Group>
                    <Button className="mx-5" variant="primary" type="submit">Registrar Operación</Button>
             </Form>
             <Stack direction="horizontal" className="m-2 my-5" gap={2}>
                <Switch defaultChecked onChange={activarRegistroMultiple}/>
                <Form.Text>Registro unico por operario <strong>Por defecto: Activo</strong></Form.Text>
             </Stack>
             </ListaProvider>
            </Col>    
        )
}
export default RegistrarOperaciones
