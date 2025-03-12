import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarReferencias';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const { data, loading, error, fetchData } = useFetchData();
  const [lista, setLista] = useState([]);

  const actualizarLista = async () => {
    try {
      const nuevaLista = await fetchData();
      setLista([...nuevaLista]);
      //Wconsole.log('Nueva lista obtenida:', nuevaLista);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };

  useEffect(() => {
    actualizarLista();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ lista, loading, error, actualizarLista }}>
      {children}
    </ListaContext.Provider>
  );
};