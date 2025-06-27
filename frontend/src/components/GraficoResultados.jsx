import React from 'react'; 
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function GraficoResultados({ titulo, datos }) {
  const getBackgroundColor = (value) => {
    if (value < 2) return 'rgba(239, 68, 68, 0.6)'; // Rojo (Deficiencia)
    if (value > 4) return 'rgba(34, 197, 94, 0.6)'; // Verde (Fortaleza)
    return 'rgba(59, 130, 246, 0.6)'; // Azul (Normal)
  };

  const getBorderColor = (value) => {
    if (value < 2) return 'rgba(239, 68, 68, 1)';
    if (value > 4) return 'rgba(34, 197, 94, 1)';
    return 'rgba(59, 130, 246, 1)';
  };
  
  const chartData = {
    labels: datos.labels,
    datasets: [
      {
        label: 'Promedio',
        data: datos.values,
        backgroundColor: datos.values.map(value => getBackgroundColor(parseFloat(value))),
        borderColor: datos.values.map(value => getBorderColor(parseFloat(value))),
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: titulo,
        font: { size: 18 },
        padding: { top: 10, bottom: 30 }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 5,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(200, 200, 200, 0.2)' }
      },
      x: { grid: { display: false } }
    },
  };

  return (
    <div className="relative h-96">
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default GraficoResultados;