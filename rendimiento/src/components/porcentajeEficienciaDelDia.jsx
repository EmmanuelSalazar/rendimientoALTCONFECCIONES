import React, { useState } from "react";
import { Stack } from 'react-bootstrap';
import FechaActual from '../components/fechaActual'
const PorcentajeDeEficienciaDiaria = () => {
    const [porcentaje, setPorcentaje] = useState(99);

    const obtenerColorEficiencia = () => {
        if (porcentaje > 70) {
            return 'bg-success text-light'
            } else if (porcentaje == 70) {
                return 'bg-warning text-danger' 
            } else {
                return 'bg-danger  text-light'
            }
        }
    
    return (
        <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div className="p-2"><h4>EFICIENCIA DEL DÍA</h4></div>
            <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><h1>{porcentaje}%</h1></div>
            <div className="p-2"><FechaActual /></div>
        </Stack>
    )
}
export default PorcentajeDeEficienciaDiaria