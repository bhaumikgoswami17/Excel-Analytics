import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ChartType } from './ChartTypeSelector';

interface ChartProps {
  data: Record<string, any>[];
  xAxis: string;
  yAxis: string;
  zAxis?: string;
  type: ChartType;
  title?: string;
}

const Chart: React.FC<ChartProps> = ({ data, xAxis, yAxis, zAxis, type, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // Initialize chart
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !data.length) return;

    const xData = data.map(item => item[xAxis]);
    const yData = data.map(item => item[yAxis]);
    const zData = zAxis ? data.map(item => item[zAxis]) : undefined;

    const options = getChartOptions(type, xData, yData, zData, title, xAxis, yAxis, zAxis);
    chartInstance.current.setOption(options);
  }, [data, xAxis, yAxis, zAxis, type, title]);

  const getChartOptions = (
    chartType: ChartType,
    xData: any[],
    yData: any[],
    zData?: any[],
    chartTitle?: string,
    xAxisName?: string,
    yAxisName?: string,
    zAxisName?: string
  ): echarts.EChartsOption => {
    const baseOptions: echarts.EChartsOption = {
      title: {
        text: chartTitle || 'Chart',
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: { title: 'Save as Image' }
        }
      }
    };

    switch (chartType) {
      case 'bar':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: xData,
            name: xAxisName
          },
          yAxis: {
            type: 'value',
            name: yAxisName
          },
          series: [
            {
              data: yData,
              type: 'bar',
              name: yAxisName,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3B7BE5' },
                  { offset: 1, color: '#16BFA5' }
                ])
              }
            }
          ]
        };
      
      case 'line':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            data: xData,
            name: xAxisName
          },
          yAxis: {
            type: 'value',
            name: yAxisName
          },
          series: [
            {
              data: yData,
              type: 'line',
              name: yAxisName,
              smooth: true,
              lineStyle: {
                width: 3,
                color: '#3B7BE5'
              },
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#3B7BE5'
              }
            }
          ]
        };
      
      case 'pie':
        const pieData = xData.map((label, index) => ({
          name: label,
          value: yData[index]
        }));
        
        return {
          ...baseOptions,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: xData
          },
          series: [
            {
              name: yAxisName || 'Value',
              type: 'pie',
              radius: '60%',
              center: ['50%', '55%'],
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                show: true,
                formatter: '{b}: {d}%'
              }
            }
          ]
        };
      
      case 'scatter':
        return {
          ...baseOptions,
          xAxis: {
            type: 'value',
            name: xAxisName,
            scale: true
          },
          yAxis: {
            type: 'value',
            name: yAxisName,
            scale: true
          },
          series: [
            {
              name: yAxisName,
              type: 'scatter',
              data: xData.map((x, i) => [x, yData[i]]),
              symbolSize: 12,
              itemStyle: {
                color: '#8A63D2'
              }
            }
          ]
        };
      
      case '3dBar':
        return {
          ...baseOptions,
          grid3D: {
            viewControl: {
              projection: 'perspective',
              autoRotate: true
            }
          },
          xAxis3D: {
            type: 'category',
            name: xAxisName,
            data: xData
          },
          yAxis3D: {
            type: 'category',
            name: zAxisName,
            data: zData || Array(xData.length).fill('').map((_, i) => i.toString())
          },
          zAxis3D: {
            type: 'value',
            name: yAxisName
          },
          series: [
            {
              type: 'bar3D',
              data: xData.map((x, i) => [
                i,
                zData ? zData[i] : 0,
                yData[i]
              ]),
              shading: 'lambert',
              label: {
                show: false
              },
              itemStyle: {
                color: '#3B7BE5',
                opacity: 0.8
              },
              emphasis: {
                itemStyle: {
                  color: '#16BFA5'
                }
              }
            }
          ]
        };
      
      case '3dScatter':
        return {
          ...baseOptions,
          grid3D: {
            viewControl: {
              projection: 'perspective',
              autoRotate: true
            }
          },
          xAxis3D: {
            type: 'value',
            name: xAxisName,
            scale: true
          },
          yAxis3D: {
            type: 'value',
            name: yAxisName,
            scale: true
          },
          zAxis3D: {
            type: 'value',
            name: zAxisName,
            scale: true
          },
          series: [
            {
              type: 'scatter3D',
              data: xData.map((x, i) => [
                x,
                yData[i],
                zData ? zData[i] : 0
              ]),
              symbolSize: 12,
              itemStyle: {
                color: '#8A63D2',
                opacity: 0.8
              },
              emphasis: {
                itemStyle: {
                  color: '#16BFA5',
                  opacity: 1
                }
              }
            }
          ]
        };
      
      default:
        return baseOptions;
    }
  };

  return (
    <div 
      ref={chartRef} 
      className="w-full h-96 bg-white rounded-lg shadow-md"
      style={{ minHeight: '400px' }}
    ></div>
  );
};

export default Chart;