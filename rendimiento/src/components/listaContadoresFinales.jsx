import React from "react";
import { Table } from 'antd';
import useFetchData from "../services/api/read/mostrarContadoresFinales";

const ListaContadoresFinales = () => {
    const { data } = useFetchData();
    const columns = [
        { title: 'ID', dataIndex: 'op_id', key: 'op_id' },
        { title: 'Operario', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Modulo', dataIndex: 'modulo', key: 'modulo' },
    ]
    return (
        <Table columns={columns} dataSource={data} />
    )
}
export default ListaContadoresFinales;