import React, { useContext, useEffect, useState } from 'react';
import { ListaContext } from '../contexts/actualizarReferencias';
import EliminarReferencia from '../services/api/eliminarReferencia';
import { Table } from 'antd';
import { Alert, Button } from 'react-bootstrap'

const ListaReferencias = () => {
    const { lista, loading, error, actualizarLista } = useContext(ListaContext);
    const { fetchData } = EliminarReferencia();
        const [mensajeDeExito, setMensajeDeExito] = useState("");
    
    useEffect(() => {
            if (mensajeDeExito) {
                const timer = setTimeout(() => {
                    setMensajeDeExito("");
                }, 2000);
            return () => clearTimeout(timer);
            }
        }, [mensajeDeExito]);



    const handleDelete = async (id) => {
        try {
            await fetchData(id);
            await actualizarLista();
            await setMensajeDeExito("La referencia ha sido eliminada con éxito");
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
        }
        console.log(`Deseas eliminar ${id}?`)
    }
    const columns = [
        { title: 'Referencia', dataIndex: 'referencia', key: 'referencia'},
        { title: 'Tiempo de produccion', dataIndex: 'tiempoDeProduccion', key: 'tiempoDeProduccion'},
        { title: 'Modulo', dataIndex: 'modulo', key: 'modulo'},
/*         { title: 'Personas en produccion', dataIndex: 'cantidadPorModulo', key: 'cantidadPorModulo'},
 */        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <span>
                    <Button variant="danger" onClick={() => handleDelete(record.ref_id)}>Eliminar</Button>
                </span>
            ),
        },

    ];
    const ref_id = lista.map(id => id.ref_id) 
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {mensajeDeExito && <Alert variant="warning">{mensajeDeExito}</Alert>}
            <Table dataSource={lista} columns={columns} rowKey="ref_id" />
        </div>
);
}
export default ListaReferencias