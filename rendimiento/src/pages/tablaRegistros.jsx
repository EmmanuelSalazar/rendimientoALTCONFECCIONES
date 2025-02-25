import React, { useState } from "react";
import { Row, Col, Container, Button, ButtonGroup } from 'react-bootstrap'
import TablaRegistros from '../components/listaRegistro'
function TablaRegistro() {
        const [botonSeleccionado, setBotonSeleccionado] = useState(null);
        const handleButtonClick = async (modulo, index) => {
            let ModuloSeleccionado = modulo;

              setBotonSeleccionado(index)
          }
            const botones = [
                { label: 'Módulo 1', value: 1 },
                { label: 'Módulo 2', value: 2 },
                { label: 'Módulo 3', value: 3 },
                { label: 'Módulo 4', value: 4 },
              ];
    
    
    return (
        <Container className="mt-5">
            <Row className="my-2">
                <ButtonGroup>
                    {botones.map((boton, index) => (
                    <Button key={index} variant={botonSeleccionado === index ? 'primary' : 'secondary'} onClick={() => handleButtonClick(boton.value, index)}>{boton.label}</Button>
                    ))}
                </ButtonGroup>
            </Row>
            <Row>
                <Col xs={12}>
                    <TablaRegistros />
                </Col>
            </Row>
        </Container>
    )
}
export default TablaRegistro