import React, { useEffect, useState } from "react";
import { Stack } from 'react-bootstrap';
import FechaActual from './fechaActual'
import { ListaContext } from "../contexts/informacionGrafico";
const PorcentajeDeEficienciaDiaria = () => {
    const { lista } = React.useContext(ListaContext);
    const { fechaFormateada } = FechaActual();
    const [porcentaje, setPorcentaje] = useState(99);
    useEffect(() => {
        establecerEficiencia();
    }, [lista]);

    // Establecer el operario que calcula la eficiencia del modulo
    const operarioCalculador = lista.find(operario => operario.calculador_final === 1);
    const establecerEficiencia = () => {
        if (operarioCalculador) {
            const eficienciaCalculada = operarioCalculador.eficiencia_int;
            setPorcentaje(eficienciaCalculada);

        }
    }
    const obtenerColorEficiencia = () => {
        if (porcentaje > 70) {
            return 'bg-success text-light'
            } else if (porcentaje == 69) {
                return 'bg-success text-white' 
            } else {
                return 'bg-danger  text-light'
            }
        }
    return (
        <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div className="p-2"><h4>EFICIENCIA DEL DÍA</h4></div>
            <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
            <div className="p-2"><h5>{fechaFormateada}</h5></div>
        </Stack>
    )
}
export default PorcentajeDeEficienciaDiaria