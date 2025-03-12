import React, { useContext, useState } from 'react';
import { ListaContext } from '../contexts/actualizarRegistroOperaciones';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const ListaRegistroOperaciones = () => {
    const { listaRegistro, loading, error } = useContext(ListaContext);

    // Estado para almacenar el valor del filtro
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
    ];

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <Table dataSource={listaRegistro} columns={columns} rowKey="ref_id" />;
};

export default ListaRegistroOperaciones;