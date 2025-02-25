import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarRegistroOperaciones';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {
  const { data, loading, error, fetchData } = useFetchData();
  const [listaRegistro, setLista] = useState([]);

  const setListaRegistro = async () => {
    try {
      const nuevaLista = await fetchData();
      setLista([...nuevaLista]);
      console.log('Nueva lista obtenida:', nuevaLista);
    } catch (error) {
      console.error('Ha ocurrido un error al actualizar sus datos', error);
    }
  };

  useEffect(() => {
    setListaRegistro();
  }, [fetchData]);

  return (
    <ListaContext.Provider value={{ listaRegistro, loading, error, setListaRegistro }}>
      {children}
    </ListaContext.Provider>
  );
};