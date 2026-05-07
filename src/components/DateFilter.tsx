'use client';

import { useState } from 'react';

interface DateFilterProps {
  onFilterChange: (days: number) => void;
  currentFilter: number;
}

const FILTER_OPTIONS = [
  { label: 'Últimas 24h', days: 1 },
  { label: 'Últimos 3 días', days: 3 },
  { label: 'Última semana', days: 7 },
  { label: 'Últimas 2 semanas', days: 14 },
  { label: 'Último mes', days: 30 },
  { label: 'Todos', days: 0 }
];

export default function DateFilter({ onFilterChange, currentFilter }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (days: number) => {
    onFilterChange(days);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const option = FILTER_OPTIONS.find(opt => opt.days === currentFilter);
    return option ? option.label : 'Última semana';
  };

  return (
    <div className="date-filter-container">
      <div className="date-filter-dropdown">
        <button
          className="date-filter-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          FILTRAR: {getCurrentLabel()} ▼
        </button>
        
        {isOpen && (
          <div className="date-filter-menu">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.days}
                className={`date-filter-option ${option.days === currentFilter ? 'active' : ''}`}
                onClick={() => handleFilterSelect(option.days)}
              >
                {option.label}
                {option.days === currentFilter && ' [ACTIVO]'}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="date-filter-info">
        {currentFilter > 0 ? (
          <span>PERIODO: Últimos {currentFilter} días</span>
        ) : (
          <span>PERIODO: Todos los artículos</span>
        )}
      </div>
    </div>
  );
}
