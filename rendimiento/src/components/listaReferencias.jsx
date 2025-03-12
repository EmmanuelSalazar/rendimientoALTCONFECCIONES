import React, { useContext, useEffect, useState, useRef, act } from 'react';
import { ListaContext } from '../contexts/actualizarReferencias';
import EliminarReferencia from '../services/api/eliminarReferencia';
import ActualizarReferencia from '../services/api/update/actualizarReferencia';
import { Table } from 'antd';
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const ListaReferencias = () => {
    const { actualizarReferencia } = ActualizarReferencia();
    const { listas, loading, error, actualizarListas } = useContext(ListaContext);
    const { fetchData } = EliminarReferencia();
    const [mensajeDeExito, setMensajeDeExito] = useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
    const [mensajeDeError, setMensajeDeError] = useState("");
    const [referenciaSeleccionada, setReferenciaSeleccionada] = useState(null);
    const [visible, setVisible] = useState(false);
    const referenciaRef = useRef();
    const moduloRef = useRef();
    const tiempoDeProduccionRef = useRef();
    const estadoRef = useRef();  
    useEffect(() => {
            if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
                const timer = setTimeout(() => {
                    setMensajeDeExito("");
                    setMensajeDeAlerta("");
                    setMensajeDeError("");
                }, 3000);
            return () => clearTimeout(timer);
            }
        }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);

        const showModal = (referencia) => {
            setReferenciaSeleccionada(referencia)
            setVisible(true)
        }
    
        const handleOk = async () => {
            const values = {
                "referencia": referenciaRef.current.value,
                "tiempoDeProduccion": tiempoDeProduccionRef.current.value,
                "modulo": moduloRef.current.value,
                "estado": estadoRef.current.value
            }
            try {
                await actualizarReferencia(values);
                await actualizarListas();
                setMensajeDeExito("La referencia ha sido actualizada con éxito");
            } catch (error) {
                console.log("Ha ocurrindo un error: ", error);
            }
            console.log(values)
            setReferenciaSeleccionada(null)
            setVisible(false)
        }
    
        const handleCancel = () => {
            setReferenciaSeleccionada(null)
            setVisible(false)
        }

    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await actualizarListas();
            setMensajeDeAlerta("La referencia ha sido eliminada con éxito");
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error);
        }
    }
    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia'},
        { title: 'Tiempo de produccion', dataIndex: 'tiempoDeProduccion', key: 'tiempoDeProduccion'},
        { title: 'Modulo', dataIndex: 'modulo', key: 'modulo'},
        { title: 'Estado', dataIndex: 'estado', key: 'estado'},
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <span>
                    <Button variant="warning" className="mx-1" onClick={() => showModal(record)}>
                     Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(record.ref_id)}>Eliminar</Button>
                </span>
            ),
        },

    ];
    const ref_id = listas.map(id => id.ref_id) 
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
            {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}

            <Table dataSource={listas} columns={columns} rowKey="ref_id" />
            <Modal show={visible} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar referencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Referencia</Form.Label>
                            <Form.Control type="text" defaultValue={referenciaSeleccionada?.referencia} ref={referenciaRef} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tiempo de produccion</Form.Label>
                            <Form.Control type="number" defaultValue={referenciaSeleccionada?.tiempoDeProduccion} ref={tiempoDeProduccionRef}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Modulo</Form.Label>
                            <Form.Control type="number" defaultValue={referenciaSeleccionada?.modulo} ref={moduloRef}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Estado</Form.Label>
                            <Form.Select ref={estadoRef}>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleOk}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
);
}
export default ListaReferencias