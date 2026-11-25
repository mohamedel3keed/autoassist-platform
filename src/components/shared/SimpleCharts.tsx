import React from 'react';

interface BarChartItem {
  label: string;
  value: number;
  highlight?: boolean;
}

export const CleanBarChart: React.FC<{
  data: BarChartItem[];
  unit?: string;
  height?: number;
}> = ({ data, unit = '', height = 160 }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height }}>
        {data.map((item, idx) => {
          const pct = Math.max(8, Math.round((item.value / max) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
              <span className="text-[11px] font-mono tabular-nums text-[#64748B] mb-1.5 group-hover:text-[#172B3A] transition-colors">
                {item.value}
                {unit}
              </span>
              <div className="w-full max-w-[38px] flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-200 ${
                    item.highlight
                      ? 'bg-[#0F766E]'
                      : 'bg-[#DCEFEF] group-hover:bg-[#0F766E]/75'
                  }`}
                  style={{ height: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-3 border-t border-slate-200 pt-2 mt-2">
        {data.map((item, idx) => (
          <span
            key={idx}
            className="flex-1 text-center text-[11px] text-[#64748B] truncate"
            title={item.label}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const HorizontalBreakdownList: React.FC<{
  items: { label: string; count: number; total: number }[];
}> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const pct = Math.round((item.count / Math.max(item.total, 1)) * 100);
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#172B3A] truncate">{item.label}</span>
              <span className="font-mono tabular-nums text-[#64748B] shrink-0">
                {item.count}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0F766E] transition-all duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
