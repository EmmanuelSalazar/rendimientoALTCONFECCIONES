import React, { useEffect, useState } from "react";
import {Container, Row, Col, Stack} from 'react-bootstrap'
import HorizontalBarChart from '../components/grafico';
import BotonesSeleccionModulos from "../components/botonesSeleccionModulo";
import { ListaProvider} from "../contexts/informacionGrafico";
import PorcentajeDeEficienciaPorCorte from "../components/porcentajeEficienciaDeCorte";
import PorcentajeDeEficienciaDiaria from "../components/porcentajeEficienciaDelDia";
import TablaRegistros from "../components/listaRegistro";

function Modulo() {
  const [modulo, setModulo] = useState("");
    return ( 
    <Container style={{minWidth: '100%', padding: '1rem 1rem'}}>
      <ListaProvider>
        <Row className="mb-2">
          <BotonesSeleccionModulos />
        </Row>
        <Row>
          <Col lg="3" xs={12} sm={6} md={4} >
            <Row className='border border-primary mb-2 mx-2 bg-primary bg-opacity-50 rounded text-light' >
              <PorcentajeDeEficienciaPorCorte />
            </Row>
            <Row className='border border-primary mb-2 mx-2 bg-primary bg-opacity-50 rounded text-light'>
             <PorcentajeDeEficienciaDiaria />
            </Row>
          </Col>
          <Col lg="9" xs={12} sm={6} md={4} className='bg-black rounded border border-primary text-light text-center' >
            <h1>TABLERO MODULO {modulo} (TEST)</h1>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                  <HorizontalBarChart />
            </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <TablaRegistros />
        </Row>
        </ListaProvider>
      </Container>
    )
}
export default Modulo