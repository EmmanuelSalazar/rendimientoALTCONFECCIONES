import { createContext, useState, useEffect } from 'react';
import useFetchData from '../services/api/mostrarOperarios';
export const ListaContext = createContext();

export const ListaProvider = ({ children }) => {

  const { data, loading, error, fetchData } = useFetchData();
  const [lista, setLista] = useState([]);

  const actualizarLista = async (modulo) => {
    const moduloConsultado = modulo ?? 0;

    try {
      const nuevaLista = await fetchData(moduloConsultado);
      setLista([...nuevaLista]);
      console.log('Nueva lista obtenida:', nuevaLista);
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