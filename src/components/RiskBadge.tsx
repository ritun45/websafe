import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../types/medication';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  label,
  size = 'md',
  showIcon = true,
}) => {
  const getRiskConfig = () => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-[#B6423A]/10',
          text: 'text-[#B6423A]',
          border: 'border-[#B6423A]/30',
          icon: AlertTriangle,
          defaultLabel: 'HIGH RISK',
          aria: 'High Risk Alert',
        };
      case 'moderate':
        return {
          bg: 'bg-[#C9792B]/10',
          text: 'text-[#C9792B]',
          border: 'border-[#C9792B]/30',
          icon: AlertCircle,
          defaultLabel: 'MODERATE RISK',
          aria: 'Moderate Risk Warning',
        };
      case 'low':
        return {
          bg: 'bg-[#3F8068]/10',
          text: 'text-[#3F8068]',
          border: 'border-[#3F8068]/30',
          icon: ShieldCheck,
          defaultLabel: 'LOW RISK',
          aria: 'Low Risk Observation',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#285C50]/10',
          text: 'text-[#285C50]',
          border: 'border-[#285C50]/30',
          icon: Info,
          defaultLabel: 'INFORMATIONAL',
          aria: 'Informational Notice',
        };
    }
  };

  const config = getRiskConfig();
  const IconComponent = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-semibold rounded-full',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold tracking-wider rounded-full',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide rounded-full',
  }[size];

  return (
    <span
      className={`inline-flex items-center border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      role="status"
      aria-label={config.aria}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} strokeWidth={2} />}
      <span>{displayLabel}</span>
    </span>
  );
};
