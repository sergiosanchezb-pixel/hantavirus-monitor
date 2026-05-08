'use client';

import { useState } from 'react';

interface DateFilterProps {
  onFilterChange: (days: number) => void;
  currentFilter: number;
  locale?: 'es' | 'en';
}

const FILTER_OPTIONS_ES = [
  { label: 'Últimas 24h', days: 1 },
  { label: 'Últimos 3 días', days: 3 },
  { label: 'Última semana', days: 7 },
  { label: 'Últimas 2 semanas', days: 14 },
  { label: 'Último mes', days: 30 },
  { label: 'Todos', days: 0 },
];

const FILTER_OPTIONS_EN = [
  { label: 'Last 24h', days: 1 },
  { label: 'Last 3 days', days: 3 },
  { label: 'Last week', days: 7 },
  { label: 'Last 2 weeks', days: 14 },
  { label: 'Last month', days: 30 },
  { label: 'All', days: 0 },
];

export default function DateFilter({ onFilterChange, currentFilter, locale = 'es' }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = locale === 'en' ? FILTER_OPTIONS_EN : FILTER_OPTIONS_ES;
  const filterLabel = locale === 'en' ? 'FILTER' : 'FILTRAR';
  const activeLabel = locale === 'en' ? '[ACTIVE]' : '[ACTIVO]';
  const defaultLabel = locale === 'en' ? 'Last week' : 'Última semana';
  const periodLabel = locale === 'en' ? 'PERIOD' : 'PERIODO';
  const daysLabel = locale === 'en' ? 'days' : 'días';
  const allLabel = locale === 'en' ? 'All articles' : 'Todos los artículos';
  const lastLabel = locale === 'en' ? 'Last' : 'Últimos';

  const handleFilterSelect = (days: number) => {
    onFilterChange(days);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const option = options.find(opt => opt.days === currentFilter);
    return option ? option.label : defaultLabel;
  };

  return (
    <div className="date-filter-container">
      <div className="date-filter-dropdown">
        <button
          className="date-filter-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {filterLabel}: {getCurrentLabel()} ▼
        </button>

        {isOpen && (
          <div className="date-filter-menu">
            {options.map((option) => (
              <button
                key={option.days}
                className={`date-filter-option ${option.days === currentFilter ? 'active' : ''}`}
                onClick={() => handleFilterSelect(option.days)}
              >
                {option.label}
                {option.days === currentFilter && ` ${activeLabel}`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="date-filter-info">
        {currentFilter > 0 ? (
          <span>{periodLabel}: {lastLabel} {currentFilter} {daysLabel}</span>
        ) : (
          <span>{periodLabel}: {allLabel}</span>
        )}
      </div>
    </div>
  );
}
