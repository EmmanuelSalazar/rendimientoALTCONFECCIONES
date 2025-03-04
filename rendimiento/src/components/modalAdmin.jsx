import React from "react";
import { Modal, Button, DatePicker, Space } from 'antd'
import ListaRegistroOperaciones from "./listaRegistroOperaciones";
import {ListaContext } from "../contexts/actualizarRegistroOperaciones";
const { RangePicker } = DatePicker;
const FechasDuales = () => {
    const { setListaRegistro } = React.useContext(ListaContext)
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const disabledTime = (current) => {
        if (!current) return {};
        const hour = current.hour();
        return {
            disabledHours: () => [0, 1, 2, 3, 4, 5, 17, 18, 19, 20, 21, 22, 23], // Horas deshabilitadas
        };
    };

    const showModal = () => { 
        setVisible(true)
    }

    const handleOk = () => {
        setVisible(false)
    }

    const handleCancel = () => { 
        setVisible(false)
    }
    const onChangeHours = async (time, timeStrings) => {
        window.horaInicio = timeStrings[0];
        window.horaFin = timeStrings[1];
        try {
            await setListaRegistro(window.moduloConsultado, window.fechaInicio, window.fechaFin, window.horaInicio, window.horaFin);
        } catch (error) {
            console.log("Ha ocurrido un error: ", error)
        }
    }
    const onPanelChange = async (dates, dateStrings) => {
        window.fechaInicio = dateStrings[0];
        window.fechaFin = dateStrings[1];
        try {
            await setListaRegistro(window.moduloConsultado, dateStrings[0], dateStrings[1], window.horaInicio, window.horaFin)
        } catch (error) {
            console.error("Ha ocurrido un error: ",error)
        }
        
        console.log(dateStrings[0])
    }
    return (
        <>
            <Button type="primary" onClick={showModal}>Seleccionar entre dos rangos</Button>
            <Modal title="Selecciona dos fechas" open={visible} onOk={handleOk} onCancel={handleCancel} width={{xl: '70%', xxl: '70%'}}>
                    <Space className="my-2">
                        <strong>Seleccionar fecha</strong>
                        <RangePicker onChange={onPanelChange}/>
                        <strong>Seleccionar hora</strong>
                        <RangePicker onChange={onChangeHours} picker="time" format="HH" disabledTime={disabledTime}/>
                    </Space>
                    <ListaRegistroOperaciones />
            </Modal>
        </>
    )
}
export default FechasDuales;