import React, { useContext, useState, useEffect, useRef } from 'react';
import { ListaContext } from '../contexts/actualizarOperarios';
import EliminarOperario from '../services/api/eliminarOperario';
import ActualizarOperario from '../services/api/update/actualizarOperario';
import { Table } from 'antd';
import { Alert, Button, Modal, Form } from 'react-bootstrap';

const ListaOperarios = () => {
    const { lista, loading, error, actualizarLista } = useContext(ListaContext);
    const [mensajeDeExito, setMensajeDeExito] = useState("");
    const [mensajeDeAdvertencia, setMensajeDeAdvertencia] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [operarioSeleccionado, setOperarioSeleccionado] = useState(null);
    const { fetchData } = EliminarOperario();
    const { actualizarOperario } = ActualizarOperario();
    const nombreOperarioRef = useRef();
    const moduloRef = useRef();
    const actividadRef = useRef();
    useEffect(() => {
        if (mensajeDeExito || mensajeDeAdvertencia) {
            const timer = setTimeout(() => {
                setMensajeDeExito("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [mensajeDeExito, mensajeDeAdvertencia]);

    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await actualizarLista();
            setMensajeDeAdvertencia("El operario ha sido eliminado");
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
        }
    };

    const handleShow = (operario) => {
        setOperarioSeleccionado(operario); 
        setMostrar(true)
    };

    const handleClose = () => {
        setOperarioSeleccionado(null); 
        setMostrar(false); 
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = {
            "nombreOperario": nombreOperarioRef.current.value,
            "modulo": moduloRef.current.value,
            "actividad": actividadRef.current.value
        };
        try {
            await actualizarOperario(operarioSeleccionado.op_id, false, values);
            await actualizarLista();
            setMensajeDeExito("El operario ha sido actualizado con exito");
            setMostrar(null)
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
        }
    }

    const columns = [
        { title: 'ID', dataIndex: 'op_id', key: 'op_id' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Módulo', dataIndex: 'modulo', key: 'modulo' },
        { title: 'Estado', dataIndex: 'estado', key: 'estado' },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <span>
                    <Button variant="warning" className="mx-1" onClick={() => handleShow(record)}>
                        Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(record.op_id)}>
                        Eliminar
                    </Button>
                </span>
            ),
        },
    ];

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAdvertencia && <Alert variant="warning">{mensajeDeAdvertencia}</Alert>}
            <Table dataSource={lista} columns={columns} rowKey="op_id" />

            {/* Modal */}
            <Modal show={mostrar} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Operario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {operarioSeleccionado && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" defaultValue={operarioSeleccionado.nombre} required ref={nombreOperarioRef}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Módulo</Form.Label>
                                <Form.Control type="number" defaultValue={operarioSeleccionado.modulo} required ref={moduloRef}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Activo / Inactivo</Form.Label>
                                <Form.Select ref={actividadRef}>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} type='submit'>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaOperarios;