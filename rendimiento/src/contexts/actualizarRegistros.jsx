import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/read/mostrarIngresosPorHoras';
import FechaActual from '../components/fechaActual';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const { fechaActualDia } = FechaActual();
  const { data, loading, error, fetchData } = useFetchData();
  const [lista, setLista] = useState([]);
   
  const listaActualizada = async (fecha, modulo) => {
    window.moduloConsultado = modulo;
    const fechaConsultada = fecha ?? fechaActualDia;
    try {
      const nuevaLista = await fetchData(fechaConsultada, modulo);
      setLista([...nuevaLista]);
      //console.log('Nueva lista obtenida:', nuevaLista);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };

  useEffect(() => {
    listaActualizada();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ lista, loading, error, listaActualizada }}>
      {children}
    </ListaContext.Provider>
  );
};