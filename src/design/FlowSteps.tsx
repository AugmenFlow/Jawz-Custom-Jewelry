import React from 'react';
import { ChevronRight } from 'lucide-react';

/** Step chips shared by the Design Studio and booking form so the journey looks the same everywhere. */
export default function FlowSteps({
  steps,
  active,
  onStepClick,
  className = '',
}: {
  steps: string[];
  active: number;
  onStepClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <ol className={`flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${className}`} aria-label="Progress">
      {steps.map((label, i) => {
        const chip = `px-3 py-2 rounded-sm transition-colors ${
          i === active
            ? 'bg-[#D4D4D8] text-black'
            : i < active
              ? 'border border-[#D4D4D8]/50 text-[#D4D4D8]'
              : 'border border-white/15 text-zinc-400'
        }`;
        return (
          <React.Fragment key={label}>
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />}
            <li aria-current={i === active ? 'step' : undefined}>
              {onStepClick && i < active ? (
                <button type="button" onClick={() => onStepClick(i)} className={`${chip} hover:text-white`}>
                  {i + 1}. {label}
                </button>
              ) : (
                <span className={`block ${chip}`}>{i + 1}. {label}</span>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}
