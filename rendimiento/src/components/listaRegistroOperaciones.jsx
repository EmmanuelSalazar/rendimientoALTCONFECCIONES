import React, { useContext } from 'react';
import { ListaContext } from '../contexts/actualizarRegistroOperaciones';
import { Table } from 'antd';

const ListaRegistroOperaciones = () => {
    const { listaRegistro, loading, error, setListaRegistro } = useContext(ListaContext);
    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha'},
        { title: 'Operador', dataIndex: 'nombre_operario', key: 'nombre_operario'},
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia'},
        { title: 'Unidades producidas', dataIndex: 'unidadesProducidas', key: 'unidadesProducidas'},
        { title: 'Meta de eficiencia', dataIndex: 'metaAjustada', key: 'metaAjustada'},
        { title: 'Eficiencia', dataIndex: 'eficiencia', key: 'eficiencia'}

    ];
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <Table dataSource={listaRegistro} columns={columns} rowKey="ref_id" />;
}
export default ListaRegistroOperaciones