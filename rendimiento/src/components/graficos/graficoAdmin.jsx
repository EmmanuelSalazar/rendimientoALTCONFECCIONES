import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import { ListaContext } from '../../contexts/informacionGrafico';

const GraficaAdministrativa = () => {
    const { lista, loading, error } = useContext(ListaContext);
    const nombre_operario = lista.map(persona => `${persona.nombre_operario}  (${persona.eficiencia})`);
    const totalUnidadesProducidas = lista.map(persona => persona.total_unidades_producidas);
    const totalMetaEficiencia = lista.map(persona => persona.total_meta_eficiencia);

    const data = {
        labels: nombre_operario,
        datasets: [
          {
            label: ['Meta'],
            data: totalMetaEficiencia,
            borderWidth: 1,
            borderRadius: 20,
            backgroundColor: 'rgba(137,243,54)'
          },
          {
            label: 'Progreso',
            data: totalUnidadesProducidas,
            borderWidth: 1,
            borderRadius: 20,
            backgroundColor: '#0000ff'
          },
          
        ],
      };
    
      const options = {
        responsive: true,
        indexAxis: 'y',
        scales: {
            y: {
              ticks: {
                font: {
                  size: 16,
                  weight: 'bold'
                },
                color: 'black',
              },
            },
            x: {
              ticks: {
                font: {
                  size: 16,
                  weight: 'bold'
                },
                color: 'black'
              },
            }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'black'
          },
        },
      },
    };
    
      const styles = {
        maxWidth: '1280px',
        display: 'flex',
        justifyContent: 'center',
      };
    
      if (loading) {
        return (
          <div style={styles}>
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p className="mt-2">Cargando datos...</p>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div style={styles}>
            <Alert variant="danger">
              Error al cargar los datos: {error.message}
            </Alert>
          </div>
        );
      }
    
      return (
        <div style={styles}>
          <Bar data={data} options={options}/>
        </div>
      );
}
export default GraficaAdministrativa;