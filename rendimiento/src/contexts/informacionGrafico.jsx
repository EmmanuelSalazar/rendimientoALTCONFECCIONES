import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/registro_produccion';
export const ListaContext = createContext();
import FechaActual from '../components/fechaActual';

export const ListaProvider = ({ children }) => {
  const { fechaActualDia } = FechaActual();

  const { data, loading, error, fetchData } = useFetchData();
  const [lista, setLista] = useState([]);
  
  const actualizarLista = async (fecha, modulo, operarios) => {
    window.moduloConsultado = modulo;
    window.fechaConsultada = fecha ?? fechaActualDia;
    window.operariosConsultados = operarios

    try {
      const nuevaLista = await fetchData(fechaConsultada, moduloConsultado, operarios);
      if (!Array.isArray(nuevaLista)) {
        console.error("La respuesta no es un array:", nuevaLista);
        return;
    }
      setLista([...nuevaLista]);
      //console.log('Nueva lista obtenida:', nuevaLista);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      actualizarLista(window.fechaConsultada, window.moduloConsultado, window.operariosConsultados);
    }, 60000);

    return () => clearInterval(interval);
  }, []);
        
  useEffect(() => {
    actualizarLista();
  }, [fetchData]);
  
  

  return (
    <ListaContext.Provider value={{ lista, loading, error, actualizarLista }}>
      {children}
    </ListaContext.Provider>
  );
};
