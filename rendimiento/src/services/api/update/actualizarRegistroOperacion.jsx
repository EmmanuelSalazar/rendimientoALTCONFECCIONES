import {useState, useEffect, useCallback} from "react";
import axios from 'axios';

const ActualizarRegistroOperacion = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const [datos, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const actualizarRegistroOperacion = useCallback(async (values) => {
      let informacion = values ?? {};
        try {
          const response = await axios.put(`${apiURL}/UPDATE/actualizarRegistroOperacion.php`, informacion);
          
          // Validar estructura de respuesta
          if (response.data.ok && Array.isArray(response.data)) {
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
            actualizarRegistroOperacion();
        }, [actualizarRegistroOperacion]);
        return {datos, error, actualizarRegistroOperacion}
}
export default ActualizarRegistroOperacion;