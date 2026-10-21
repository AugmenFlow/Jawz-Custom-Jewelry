import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Formats a Date as YYYY-MM-DD using the visitor's local time zone. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DateCalendarProps {
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable date (YYYY-MM-DD). Defaults to today. */
  min?: string;
}

export default function DateCalendar({ value, onChange, min }: DateCalendarProps) {
  const todayKey = toDateKey(new Date());
  const minKey = min ?? todayKey;
  const initial = value ? fromDateKey(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  // Keep the visible month in sync when the date is changed from outside (e.g. quick-pick buttons).
  useEffect(() => {
    if (!value) return;
    const d = fromDateKey(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  const minDate = fromDateKey(minKey);
  const canGoPrev =
    viewYear > minDate.getFullYear() ||
    (viewYear === minDate.getFullYear() && viewMonth > minDate.getMonth());

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-black border border-white/20 rounded-sm p-3 select-none">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-1 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-white">{monthLabel}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="p-1 rounded text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold py-1">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const key = toDateKey(new Date(viewYear, viewMonth, day));
          const isPast = key < minKey;
          const isSelected = key === value;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onChange(key)}
              aria-label={fromDateKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              aria-pressed={isSelected}
              className={`aspect-square text-xs rounded-sm border transition-all ${
                isPast
                  ? 'text-zinc-700 border-transparent cursor-not-allowed'
                  : isSelected
                    ? 'bg-[#D4D4D8] text-black font-bold border-[#D4D4D8]'
                    : isToday
                      ? 'text-white border-white/30 hover:bg-zinc-800'
                      : 'text-zinc-300 border-transparent hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
