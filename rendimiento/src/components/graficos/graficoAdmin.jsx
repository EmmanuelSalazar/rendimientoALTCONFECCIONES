import React, { useContext } from "react";
import { Spin } from 'antd'
import { Alert } from 'react-bootstrap'
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
    
    if (loading) return <Spin className='mt-5' tip="Cargando..."><div></div></Spin>;
    if (error) return <Alert variant='danger'>Error: {error.message}</Alert>;
    
      return (
        <div style={styles}>
          <Bar data={data} options={options}/>
        </div>
      );
}
export default GraficaAdministrativa;