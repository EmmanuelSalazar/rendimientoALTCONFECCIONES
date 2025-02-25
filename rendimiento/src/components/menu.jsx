import React, { useState } from 'react'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'

const items = [
    {
        label: <NavLink to="/modulo">Modulos</NavLink>,
        key: 'modulos',
        },{
            label: <NavLink to="/referencias">Referencias</NavLink>,
            key: 'referencias'
        },{
            label: <NavLink to="/operarios">Operarios</NavLink>,
            key: 'operarios'
        },{
          label: <NavLink to="/registro_operaciones">Registrar operaciones</NavLink>,
          key: 'operaciones'
      },{
        label: <NavLink to="/tablaRegistros">Tabla de registros</NavLink>,
        key: 'tablaRegistros'
    }
];

const MenuPrincipal = () => {
    const [current, setCurrent] = useState('modulos');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}
export default MenuPrincipal

