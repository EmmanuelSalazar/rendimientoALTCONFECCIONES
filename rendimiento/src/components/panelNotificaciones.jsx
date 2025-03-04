import React from "react";
import { Stack } from 'react-bootstrap';
import { ListaContext } from '../contexts/informacionGrafico';
const PanelNotificaciones = () => {
    const { lista } = React.useContext(ListaContext);
    return (
            <>
                <Stack gap={1} direction="horizontal">
                    {
                        lista.map((notificacion, index) => {
                            if (notificacion.eficiencia_int <= 69) {
                                return <div key={index} className="p-2  rounded bg-danger"><strong>{notificacion.nombre_operario}</strong> tiene un bajo rendimiento, debes mejorar <strong>┗( T﹏T )┛</strong></div>
                            } else if(notificacion.eficiencia_int >= 90) {
                                return <div key={index} className="p-2  rounded bg-success"><strong>{notificacion.nombre_operario}</strong> tiene un buen rendimiento, sigue así <strong>( •̀ ω •́ )✧</strong></div>
                            } else {
                                return [];
                            }
                        })
                    }
                </Stack>
            </>
    )
}
export default PanelNotificaciones;