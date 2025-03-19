import React, { useContext, useState, useEffect } from "react";
import { Table } from 'antd'
import { Button, Stack } from 'react-bootstrap';
import { ListaContext } from "../../contexts/actualizarRegistros";
import { ListaContext as ContextoEnLista } from "../../contexts/informacionGrafico";
import ExportToExcel from "../exportarExcel";
const columns = [
    { title: 'Operario', dataIndex: 'Operario', render: (text) => <a>{text}</a>},
    { title: '7 am', dataIndex: '7 AM', key: '7 am'},
    { title: '8 am', dataIndex: '8 AM', key: '8 am'},
    { title: '9:15 am', dataIndex: '9 AM', key: '9 am'},
    { title: '10:15 am', dataIndex: '10 AM', key: '10 am'},
    { title: '11:15 am', dataIndex: '11 AM', key: '11 am'},
    { title: '12:30 am', dataIndex: '12 PM', key: '12 am'},
    { title: '1:30 pm', dataIndex: '1 PM', key: '1 pm'},
    { title: '2:35 pm', dataIndex: '2 PM', key: '2 pm'},
    { title: '3:41 pm', dataIndex: '3 PM', key: '3 pm'},

];


const TablaRegistros = () => {
    // CONTEXTOS
    const { lista } = useContext(ListaContext);
    const { actualizarLista } = useContext(ContextoEnLista);
    //
    const [seleccionados, setSeleccionados] = useState([]);
    const [loading, setLoading] = useState(false);
     // MANEJO DE ALERTAS EXITO/ALERTA/ERROR
     const [mensajeDeExito, setMensajeDeExito] = useState("");
     const [mensajeDeAlerta, setMensajeDeAlerta] = useState("");
     const [mensajeDeError, setMensajeDeError] = useState("");
     useEffect(() => {
         if (mensajeDeExito || mensajeDeAlerta || mensajeDeError) {
             const timer = setTimeout(() => {
                 setMensajeDeExito("");
                 setMensajeDeError("");
                 setMensajeDeAlerta("");
             }, 3000);
             return () => clearTimeout(timer);
         }
     }, [mensajeDeExito, mensajeDeAlerta, mensajeDeError]);
     // CONSEGUIR EFICIENCIA POR OPERARIOS
    const realizarBusqueda = async () => {
        setLoading(true);
        try {
            // DEBUG: console.log("Nuevos seleccionados: ", seleccionados);
            await actualizarLista(window.fechaConsultada, window.moduloConsultado, seleccionados);
        } catch (error) {
            setMensajeDeError("Ha ocurrido un error: ", error)
        }
        setTimeout(() => {
            setSeleccionados([]);
            setLoading(false);
        }, 1000);
    }
    // ALMACENAR USUARIOS POR MEDIR EFICIENCIA
    const onSelectChange = (nuevosSeleccionados) => {
        const jsonSeleccionados = nuevosSeleccionados.join();
        setSeleccionados(jsonSeleccionados)
    }
    // MANEJO DE FILA
    const rowSelection = {
        seleccionados,
        onChange: onSelectChange
    }
    return (
        <>
            {mensajeDeError && <Alert variant="danger">{mensajeDeError}</Alert>}
            <Table rowSelection={rowSelection} dataSource={lista} columns={columns} rowKey="op_id" size="middle"/>
            <Stack direction="horizontal" gap={2} className="my-2">
                <Button variant="primary" onClick={realizarBusqueda} loading={loading}>Buscar</Button>
                <ExportToExcel datos={lista} />
            </Stack>
            
        </>
    );
}
export default TablaRegistros