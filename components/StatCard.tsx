import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, subtext, highlight = false }) => {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${highlight ? 'bg-primary-50 border-primary-100 shadow-sm' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${highlight ? 'text-primary-900' : 'text-slate-800'}`}>
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-slate-400 mt-1">{subtext}</span>
        )}
      </div>
    </div>
  );
};