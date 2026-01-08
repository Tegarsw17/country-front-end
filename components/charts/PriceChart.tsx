'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  LineSeries,
  LineData,
  ISeriesApi,
} from 'lightweight-charts';
import { useOraclePrices } from '@/hooks/useOraclePrices';

interface PriceChartProps {
  countryCode: string;
}


export default function PriceChart({ countryCode }: PriceChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const { data, loading } = useOraclePrices(countryCode);


  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#020617' },
        textColor: '#e5e7eb',
      },
      grid: {
        vertLines: { color: '#0f172a' },
        horzLines: { color: '#0f172a' },
      },
      width: ref.current.clientWidth,
      height: 320,
    });

    const lineSeries = chart.addSeries(LineSeries,{
      color: '#22c55e',
      lineWidth: 2,  
    })

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!seriesRef.current) return;
    if (!data || data.length === 0) return;

    seriesRef.current.setData(data as LineData[]);
    chartRef.current?.timeScale().fitContent();
  }, [data, loading]);

  return (
    <div
      ref={ref}
      className="w-full rounded-xl border border-slate-800"
    />
  );
}
