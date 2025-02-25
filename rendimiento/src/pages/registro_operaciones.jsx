import React from "react";
import RegistrarOperaciones from '../components/registrarOperaciones'
import ListaRegistroOperaciones from "../components/listaRegistroOperaciones";
import { ListaProvider } from "../contexts/actualizarOperarios";
import { ListaProvider as ProveedorLista } from "../contexts/actualizarRegistroOperaciones";
import { Col, Row, Container } from 'react-bootstrap';
function RegistroOperaciones() {
    return (
        
        <Container className="p-2 align-items-space-around">
           <ListaProvider>
            <ProveedorLista>
                <Row>
                    <Col lg="5" className="formulario">
                        <RegistrarOperaciones />
                    </Col>
                    <Col lg="7">
                        <ListaRegistroOperaciones />
                    </Col>
                </Row>
            </ProveedorLista>
          </ListaProvider> 
       </Container>
    )
}
export default RegistroOperaciones