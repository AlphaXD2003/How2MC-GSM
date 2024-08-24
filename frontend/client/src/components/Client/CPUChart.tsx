import  { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto';

const ChartGraph = ({data, label} : {data: any , label: string}) => {
    const chartRef = useRef<any>(null);

    useEffect(() =>{
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((data: any) => data.time),
                datasets: [{
                    label: label.toUpperCase(),
                    data: data.map((data: any) => data.cpu),
                    borderColor: 'rgb(255, 255, 255)', 
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100 
                    }
                }
            }
        })

        return () => chart.destroy()

    }, [data])

  return (
    <div className="chart-container w-[800px]" >
        <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default ChartGraph