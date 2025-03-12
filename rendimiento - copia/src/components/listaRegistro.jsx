import React, { useContext, useState } from "react";
import { Table, Button } from 'antd'
import { ListaContext } from "../contexts/actualizarRegistros";
import { ListaContext as ContextoEnLista } from "../contexts/informacionGrafico";
const columns = [
    { title: 'Operario', dataIndex: 'Operario', render: (text) => <a>{text}</a>},
    { title: '7 am', dataIndex: '7 am', key: '7 am'},
    { title: '8 am', dataIndex: '8 am', key: '8 am'},
    { title: '9:15 am', dataIndex: '9 am', key: '9 am'},
    { title: '10:15 am', dataIndex: '10 am', key: '10 am'},
    { title: '11:15 am', dataIndex: '11 am', key: '11 am'},
    { title: '12:30 am', dataIndex: '12 am', key: '12 am'},
    { title: '1:30 pm', dataIndex: '1 pm', key: '1 pm'},
    { title: '2:35 pm', dataIndex: '2 pm', key: '2 pm'},
    { title: '3:41 pm', dataIndex: '3 pm', key: '3 pm'},

];


const TablaRegistros = () => {
    const { actualizarLista } = useContext(ContextoEnLista);
    const [seleccionados, setSeleccionados] = useState([]);
    const [loading, setLoading] = useState(false);

    const realizarBusqueda = async () => {
        setLoading(true);
        try {
            // DEBUG: console.log("Nuevos seleccionados: ", seleccionados);
            await actualizarLista(window.fechaConsultada, window.moduloConsultado, seleccionados);
        } catch (error) {
            console.log('Ha ocurrido un error: ', error);
        }
        setTimeout(() => {
            setSeleccionados([]);
            setLoading(false);
        }, 1000);
    }

    const onSelectChange = (nuevosSeleccionados) => {
        const jsonSeleccionados = nuevosSeleccionados.join();
        setSeleccionados(jsonSeleccionados)
    }

    const rowSelection = {
        seleccionados,
        onChange: onSelectChange
    }

    const { lista } = useContext(ListaContext);

    return (
        <div>
            <Table rowSelection={rowSelection} dataSource={lista} columns={columns} rowKey="op_id" size="middle"/>
            <Button type="primary" onClick={realizarBusqueda} loading={loading}>Buscar</Button>
        </div>
    );
}
export default TablaRegistros