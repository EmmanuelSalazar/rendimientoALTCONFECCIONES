import React, { useState, useEffect } from "react";
import { Stack } from 'react-bootstrap'
import data from '../utils/json/cortePorQuincena.json'
import { ListaContext } from "../contexts/informacionGrafico";

const PorcentajeDeEficienciaPorCorte = () => {
    const { lista } = React.useContext(ListaContext);
    const [porcentaje, setPorcentaje] = useState("--");
    var corteQuincena = "";
    
    useEffect(() => {
            establecerEficiencia();
        }, [lista]);
    const operarioCalculador = lista.find(operario => operario.calculador_final === 1);
    
    const establecerEficiencia = () => {
        if (operarioCalculador) {
            const eficienciaCalculada = operarioCalculador.eficiencia_quincenal;
            setPorcentaje(eficienciaCalculada);

        }
    }
    const obtenerColorEficiencia = () => {
        if (porcentaje > 70) {
            return 'bg-success text-light'
            } else if (porcentaje == 69) {
                return 'bg-success text-white' 
            } else if(porcentaje == "--") {
                return 'bg-warning  text-danger'
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
                  <div className="p-2"><h4><strong>INCENTIVO QUINCENA</strong></h4></div>
                  <div className={`p-2 rounded ${obtenerColorEficiencia()} numeroConPorcentaje`}><strong className="porcentajeEficienciaTitulo">{porcentaje}%</strong></div>
                  <div className="p-2"><h5><strong>{corteQuincena}</strong></h5></div>
        </Stack>
    )

}
export default PorcentajeDeEficienciaPorCorte