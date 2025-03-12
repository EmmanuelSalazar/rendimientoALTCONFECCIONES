import React from "react";
import { Row, Col, Container } from 'react-bootstrap'
import TablaRegistros from '../components/listaRegistro'
import { ListaProvider} from "../contexts/actualizarRegistros";
import { ListaProvider as ProveedorDeLista } from '../contexts/informacionGrafico'
import { ListaProvider as ProveedorDeLista2 } from '../contexts/actualizarRegistroOperaciones'
import BotonesSeleccionModulos from '../components/botonesSeleccion/botonesSeleccionModuloAdmin'
import CalendarioSeleccion from "../components/calendarioSeleccionAdmin";
import GraficaAdministrativa from "../components/graficos/graficoAdmin";
import FechasDuales from "../components/modalAdmin";
import PanelAdministrativo from '../components/modal/seleccionarOperarioContador'
function TablaRegistro() {

    return (
        <Container className="mt-2">
            <ListaProvider>
                <ProveedorDeLista>
                <Row className="my-2 ">
                    <BotonesSeleccionModulos />
                </Row>
                <Row className="d-flex justify-content-between" style={{minHeight: '75vh', maxHeight: '75vh'}}>
                    <Col lg={3} xs={12} md={6} className="mx-1">
                        <CalendarioSeleccion />
                        <ProveedorDeLista2>
                            <FechasDuales />
                        </ProveedorDeLista2>
                    </Col>
                    <Col xs={8}>
                        <TablaRegistros />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} xs={12} md={6} className="bg-primary bg-opacity-50 rounded border border-primary my-2">
                    <GraficaAdministrativa />
                    </Col>
                </Row>
                </ProveedorDeLista>
            </ListaProvider>
                <Row>
                    <Col lg={3}>
                    <PanelAdministrativo />
                    </Col>
                </Row>
        </Container>
    )
}
export default TablaRegistro