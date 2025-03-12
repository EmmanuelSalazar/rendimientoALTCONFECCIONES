import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarReferencias';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const { data, loading, error, fetchData } = useFetchData();
  const [listas, setLista] = useState([]);

  const actualizarListas = async (modulo) => {
    let moduloConsultado = modulo ?? null;
    try {
      const nuevaLista = await fetchData(moduloConsultado);
      setLista([...nuevaLista]);
      //Wconsole.log('Nueva lista obtenida:', nuevaLista);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };

  useEffect(() => {
    actualizarListas();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ listas, loading, error, actualizarListas }}>
      {children}
    </ListaContext.Provider>
  );
};