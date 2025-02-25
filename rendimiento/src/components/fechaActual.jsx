import React from "react";

const FechaActual = () => {
    const fecha = new Date();
    const opciones = {year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    return (
        <h5>{fechaFormateada}</h5>
    )
}
export default FechaActual