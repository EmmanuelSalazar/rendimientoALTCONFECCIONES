import React from "react";
import { Container, Col, Row } from 'react-bootstrap'
import AgregarReferencia from '../components/agregarReferencia'
import { ListaProvider } from "../contexts/actualizarReferencias";
import ListaReferencias from "../components/listaReferencias";

function Referencias() {
    return (
        <Container>
            <h1>Registrar Referencia</h1>
            <Row className="g-5">
                <ListaProvider>
                <Col lg="5">
                    <AgregarReferencia/>
                </Col>
                <Col lg="7">
                    <ListaReferencias />
                </Col>
                </ListaProvider>
            </Row>
        </Container>
    )
}
export default Referencias
