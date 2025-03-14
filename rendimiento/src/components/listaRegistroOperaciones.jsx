import React, { useContext, useState, useRef, useEffect } from 'react';
import { ListaContext } from '../contexts/actualizarRegistroOperaciones';
import { Table, Input, Button, Space } from 'antd';
import { Button as ButtonBS, Modal, Form, Alert } from 'react-bootstrap';
import { SearchOutlined } from '@ant-design/icons';
import { ListaContext as ListaContexto} from "../contexts/actualizarReferencias";
import ActualizarRegistroOperacion from '../services/api/update/actualizarRegistroOperacion';
import EliminarRegistroOperacion from '../services/api/delete/eliminarRegistroOperacion';

const ListaRegistroOperaciones = () => {
    const { fetchData, data } = EliminarRegistroOperacion();
    const { actualizarRegistroOperacion } = ActualizarRegistroOperacion();
    const { listas } = React.useContext(ListaContexto);
    const { listaRegistro, loading, error, setListaRegistro } = useContext(ListaContext);
    const [visible, setVisible] = useState(false);
    const [registroSeleccionado, setRegistroSeleccionado] = useState("");
    const [mensajeDeExito, setMensajeDeExito] = useState("");
    const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
    // Almacenar Formulario
    const nombreOperarioRef = useRef();
    const referenciaRef = useRef();
    const unidadesProducidasRef = useRef();
    const horarioRef = useRef();
    // Estado para almacenar el valor del filtro
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    // Funcion que limita el tiempo de mensaje Exito/Aviso/Error
        useEffect(() => {
                if (mensajeDeExito || mensajeDeAlerta) {
                    const timer = setTimeout(() => {
                        setMensajeDeExito("");
                        setMensajeDeAlerta("");
                    }, 3000);
                return () => clearTimeout(timer);
                }
            }, [mensajeDeExito, mensajeDeAlerta]);
    // Función para mostrar el modal
    const showModal = (registro) => {
        setRegistroSeleccionado(registro)
        setVisible(true)
    }
    // Función para cerrar el modal
    const handleCancel = () => {
        setVisible(false)
    }
    // Funcion para eliminar datos
    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await setListaRegistro();
            setMensajeDeAlerta(data);  
        } catch (error) {
            console.log("Ha ocurrido un error: ", error)
            setMensajeDeAlerta("Ha ocurrido un error al eliminar el registro: ", error);
        }
    }

    // Funcion para procesar los cambios
    const handleOk = async () => {
        const values = {
            "regProd_id" : registroSeleccionado.regProd_id,
            "ref_id": referenciaRef.current.value,
            "unidadesProducidas": unidadesProducidasRef.current.value,
            "horario": horarioRef.current.value
        }
        try {
            await actualizarRegistroOperacion(values);
            await setListaRegistro();
            setVisible(false)
            setMensajeDeExito("El registro ha sido modificado con exito");
        } catch (error) {
            console.log("Ha ocurrido un error: ", error)
        }
    }
    // Función para limpiar el filtro
    const clearFilters = () => {
        setSearchText('');
        setSearchedColumn('');
    };
    // Configuración de las columnas con filtro en "Operador"
    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        {
            title: 'Operador',
            dataIndex: 'nombre_operario',
            key: 'nombre_operario',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar operador"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Buscar
                        </Button>
                        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                            Limpiar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record.nombre_operario.toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => document.querySelector('.ant-table-filter-dropdown input').select(), 100);
                }
            },
        },
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia' },
        { title: 'Unidades producidas', dataIndex: 'unidadesProducidas', key: 'unidadesProducidas' },
        { title: 'Meta de eficiencia', dataIndex: 'metaAjustada', key: 'metaAjustada' },
        { title: 'Eficiencia', dataIndex: 'eficiencia', key: 'eficiencia' },
        { title: 'Acciones', key: 'acciones',
            render: (text, record) => (
                <span>
                    <ButtonBS variant="warning" className="mb-1" onClick={() => showModal(record)}>
                        Editar
                    </ButtonBS>
                    <ButtonBS variant="danger" onClick={() => handleDelete(record.regProd_id)}>Eliminar</ButtonBS>
                </span>
            )
         }
    ];

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {mensajeDeExito && <Alert variant="success">{mensajeDeExito}</Alert>}
            {mensajeDeAlerta && <Alert variant="warning">{mensajeDeAlerta}</Alert>}
            <Table dataSource={listaRegistro} columns={columns} rowKey="reg_id" />
            <Modal show={visible} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Registro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Fecha del registro</Form.Label>
                            <Form.Control defaultValue={registroSeleccionado.fecha} type="text" disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nombre del operario</Form.Label>
                            <Form.Control defaultValue={registroSeleccionado.nombre_operario} type="text" disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Referencia</Form.Label>
                            <Form.Select required ref={referenciaRef}>
                                {listas.map((dato, index) => (
                                    dato.ref_id === registroSeleccionado.ref_id ? (
                                        <option value={dato.ref_id} selected>{dato.referencia}</option>
                                    ) : (
                                        <option value={dato.ref_id}>{dato.referencia}</option>
                                    )
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Unidades producidas</Form.Label>
                            <Form.Control ref={unidadesProducidasRef} defaultValue={registroSeleccionado.unidadesProducidas} type="number"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Horario del registro</Form.Label>
                            <Form.Control ref={horarioRef} defaultValue={registroSeleccionado.horario} type="number"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Meta de eficiencia</Form.Label>
                            <Form.Control defaultValue={registroSeleccionado.metaAjustada} type="number" disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Eficiencia</Form.Label>
                            <Form.Control defaultValue={registroSeleccionado.eficiencia} type="text" disabled/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonBS variant="secondary" onClick={handleCancel}>
                        Cerrar
                    </ButtonBS>
                    <ButtonBS variant="primary" onClick={handleOk}>
                        Guardar cambios
                    </ButtonBS>
                </Modal.Footer>
            </Modal>
        </>
    )
};
export default ListaRegistroOperaciones;