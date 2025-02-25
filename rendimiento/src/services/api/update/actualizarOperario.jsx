import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarOperario = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const actualizarOperario = useCallback(async (id, values) => {
        try {
          const response = await axios.put(`${apiURL}/UPDATE/actualizarOperario.php?id=${id}`, values);
          
          // Validar estructura de respuesta
          if (response.data.ok && Array.isArray(response.data.respuesta)) {
            setData(response.data.respuesta);
            return response.data.respuesta; // Array garantizado
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
            actualizarOperario();
        }, [actualizarOperario]);
        return {datos, error, actualizarOperario}
}
export default ActualizarOperario;