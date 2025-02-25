import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async (modulo) => {
        try {
          const response = await axios.get(`${apiURL}/calcularEficienciaDiaria.php?modulo=${modulo}`);
          
          // Validar estructura de respuesta
          if (response.data?.ok && Array.isArray(response.data.respuesta)) {
            setData(response.data.respuesta);
            return response.data.respuesta; // ✅ Array garantizado
          } else {
            console.error("Respuesta inválida:", response.data);
            return []; // Retornar array vacío
          }
          
        } catch (error) {
          console.error("Error en fetchData:", error);
          return []; // Retornar array vacío
        }
      }, [apiURL]);
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        return {datos, error, fetchData}
}
export default useFetchData;