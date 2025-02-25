import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import AgregarOperarios from '../components/agregarOperarios'
import { ListaProvider } from "../contexts/actualizarOperarios";
import ListaOperarios from '../components/listaOperarios';
function Operarios() {
    return (
    <Container>
        <Row>
           <h1>Agregar Operarios</h1>
           <ListaProvider>
           <Col lg="5">
            <AgregarOperarios />
           </Col>
           <Col lg="7">
            <ListaOperarios />
           </Col>
           </ListaProvider>
        </Row>
    </Container>
    )
}
export default Operarios