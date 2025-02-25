import React from "react";
import { Table } from 'antd'
import useFetchData from '../services/api/read/mostrarIngresosPorHoras'

const TablaRegistros = () => {
    const { data, error, fetchData } = useFetchData();
    const columns = [
        { title: 'Operario', dataIndex: 'Operario', key: 'Operario'},
        { title: '7 am', dataIndex: '7 am', key: '7 am'},
        { title: '8 am', dataIndex: '8 am', key: '8 am'},
        { title: '9 am', dataIndex: '9 am', key: '9 am'},
        { title: '10 am', dataIndex: '10 am', key: '10 am'},
        { title: '11 am', dataIndex: '11 am', key: '11 am'},
        { title: '1 pm', dataIndex: '1 pm', key: '1 pm'},
        { title: '2 pm', dataIndex: '2 pm', key: '2 pm'},
        { title: '3 pm', dataIndex: '3 pm', key: '3 pm'},

    ];
    return <Table dataSource={data} columns={columns}/>
}
export default TablaRegistros