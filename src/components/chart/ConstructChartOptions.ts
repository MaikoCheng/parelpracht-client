import { ChartType, TooltipItem, ChartOptions } from 'chart.js';
import { formatPriceFull } from '../../helpers/monetary';

export interface ChartSettings {
  stackXAxis: boolean;
  stackYAxis: boolean;
  tooltip: 'price' | 'labelled';
  yAxis?: 'price';
}

const priceTooltip = (tooltipItem: TooltipItem<ChartType>) => {
  return formatPriceFull(parseInt(tooltipItem.raw as string, 10));
};

const labelledTooltip = (tooltipItem: TooltipItem<ChartType>) => {
  const { label, formattedValue } = tooltipItem;
  return ` ${label}: ${formattedValue}`;
};

const priceYAxis = (tickValue: number | string) => {
  const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
  return formatPriceFull(value);
};

export default function constructChartOptions({
  stackXAxis, stackYAxis, tooltip, yAxis,
}: ChartSettings): ChartOptions {
  let label: (tooltipItem: TooltipItem<ChartType>) => string | string[];
  switch (tooltip) {
    case 'price':
      label = priceTooltip;
      break;
    case 'labelled':
      label = labelledTooltip;
      break;
    default:
      throw new TypeError(`Unknown tooltip type: ${tooltip}`);
  }

  return {
    scales: {
      x: {
        stacked: stackXAxis,
      },
      y: {
        stacked: stackYAxis,
        beginAtZero: true,
        ticks: {
          callback: yAxis === 'price' ? priceYAxis : undefined,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label,
        },
      },
    },
  };
}
