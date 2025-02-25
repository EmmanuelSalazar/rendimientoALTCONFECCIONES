import React, { useState } from "react";
import { Button, ButtonGroup } from 'react-bootstrap';
import { ListaContext } from '../contexts/informacionGrafico'

const BotonesSeleccionModulos = () => {
  
    const { actualizarLista } = React.useContext(ListaContext);
    const handleButtonClick = async (modulo, index) => {
      window.ModuloSeleccionado = modulo;
        try {
            await actualizarLista(modulo);
          } catch (error) {
            console.error("Ha ocurrido un error: ", error)
          }
        setBotonSeleccionado(index)
    }
     
    const [botonSeleccionado, setBotonSeleccionado] = useState(null);
    const botones = [
        { label: 'Módulo 1', value: 1 },
        { label: 'Módulo 2', value: 2 },
        { label: 'Módulo 3', value: 3 },
        { label: 'Módulo 4', value: 4 },
      ];

      return (
        <ButtonGroup>
          {botones.map((boton, index) => (
            <Button key={index} variant={botonSeleccionado === index ? 'primary' : 'secondary'} onClick={() => handleButtonClick(boton.value, index)}>{boton.label}</Button>
          ))}
        </ButtonGroup>
      )
}
export default BotonesSeleccionModulos