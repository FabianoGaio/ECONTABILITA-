'use client';

import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';
import type { KPI } from '@/types';

export default function KPICard({ kpi }: { kpi: KPI }) {
  const formatValue = () => {
    switch (kpi.format) {
      case 'currency':
        return formatCurrency(kpi.value);
      case 'percentage':
        return formatPercentage(kpi.value);
      case 'days':
        return `${formatNumber(kpi.value)} gg`;
      default:
        return formatNumber(kpi.value);
    }
  };

  const trendIcon = () => {
    if (!kpi.trend) return null;
    if (kpi.trend === 'up') return <span className="text-green-500">▲</span>;
    if (kpi.trend === 'down') return <span className="text-red-500">▼</span>;
    return <span className="text-gray-400">─</span>;
  };

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {kpi.label}
        </p>
        {trendIcon()}
      </div>
      <p
        className="text-xl sm:text-2xl font-bold truncate"
        style={{ color: kpi.color || '#1e40af' }}
      >
        {formatValue()}
      </p>
    </div>
  );
}
