import React from "react";
import {Container, Row, Col} from 'react-bootstrap'
import HorizontalBarChart from '../components/grafico';
import PorcentajeDeEficienciaPorCorte from "../components/porcentajeEficienciaDeCorte";
import PorcentajeDeEficienciaDiaria from "../components/porcentajeEficienciaDelDia";
import PanelNotificaciones from "../components/panelNotificaciones";
import { useSearchParams } from "react-router-dom";
function Modulo() {
  const [buscarParametro] = useSearchParams();
  let moduloEnLaUrl = buscarParametro.get('modulo');
    return ( 
    <Container className="mt-2" style={{minWidth: '100%'}}>
        <Row className="border border-primary p-1 mb-2 bg-primary bg-opacity-50 rounded text-light">
          <PanelNotificaciones />
        </Row>
        <Row>
          <Col lg="3" xs={12} sm={6} md={4} >
            <Row className='border border-primary mb-2 me-1 bg-primary  rounded text-light' >
              <PorcentajeDeEficienciaPorCorte />
            </Row>
            <Row className='border border-primary mb-2 me-1 bg-primary  rounded text-light'>
             <PorcentajeDeEficienciaDiaria />
            </Row>
          </Col>
          <Col lg="9" xs={12} sm={6} md={4} className='bg-primary rounded border border-primary text-light text-center' >            
            <h1 className="text-white">TABLERO MODULO {moduloEnLaUrl} (TEST)</h1>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                  <HorizontalBarChart />
            </div>
          </Col>
        </Row>
      </Container>
    )
}
export default Modulo