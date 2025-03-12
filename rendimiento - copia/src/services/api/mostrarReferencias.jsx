import {useState, useEffect, useCallback} from "react";
import axios from 'axios';
const useFetchData = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);
    const fetchData = useCallback(async () => {
        setLoading(true)
            try {
                const response = await axios.get(`${apiURL}/mostrarReferencias.php`)
                if (response.data.ok) {
                    setData(response.data.respuesta)
                    return response.data.respuesta
                } else {
                    console.error('Ha ocurrido un error, reinicie, si este persiste, contacte al administrador')
                    return [];
                }
                
            }  catch (error) {
                setError(error instanceof Error ? error : new Error("Ha ocurrido un error desconocido"))
                console.error("Error al obtener datos:", error)
                return [];
            } finally {
                setLoading(false)
            }
        },[]);
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        return {data, error, fetchData}
}
export default useFetchData;