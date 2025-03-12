import React, { useState } from "react";
import { Stack } from 'react-bootstrap'
import data from '../utils/json/cortePorQuincena.json'

const PorcentajeDeEficienciaPorCorte = () => {
    const [porcentaje, setPorcentaje] = useState(70);
    var corteQuincena = "";
    const obtenerColorEficiencia = () => {
        if (porcentaje > 70) {
            return 'bg-success text-light'
        } else if (porcentaje == 70) {
            return 'bg-warning text-danger' 
        } else {
            return 'bg-danger  text-light'
        }
}   
        /* CALCULAR CORTE */
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth()+1;
        const diaActual = fechaActual.getDate();
        const corte = data.find(corte => corte.mes == mesActual);
            if (diaActual <= 15) {
                corteQuincena = corte.primerCorte;
            } else {
                corteQuincena = corte.segundoCorte;
            }
        /* -------------------- */
    return (
        <Stack style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <div className="p-2"><h4>INCENTIVO QUINCENA</h4></div>
                  <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{/* {porcentaje} */}--%</strong></div>
                  <div className="p-2"><h5>{corteQuincena}</h5></div>
        </Stack>
    )

}
export default PorcentajeDeEficienciaPorCorte