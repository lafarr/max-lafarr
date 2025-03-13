'use client';

import type React from "react";

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MonthYearPickerProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseValue(value: string): { month: number; year: number } {
  if (value === '') {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  }
  const [m, y] = value.split('/');
  return { month: parseInt(m), year: parseInt(y) };
}

function formatValue(month: number, year: number): string {
  return `${month}/${year}`;
}

function formatDisplay(value: string): string {
  if (value === '') { return ''; }
  const { month, year } = parseValue(value);
  return `${MONTHS[month - 1]} ${year}`;
}

export function MonthYearPicker({ value, onChange, id }: MonthYearPickerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { month: initialMonth, year: initialYear } = parseValue(value);
  const [viewYear, setViewYear] = useState(initialYear);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (containerRef.current != null && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return (): void => { document.removeEventListener('mousedown', handler); };
  }, [isOpen, handleClose]);

  function handleSelect(month: number): void {
    onChange(formatValue(month, viewYear));
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => { setIsOpen(!isOpen); }}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className={value === '' ? 'text-muted-foreground' : ''}>
          {value === '' ? 'Select month' : formatDisplay(value)}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-3 shadow-lg"
          >
            {/* Year navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => { setViewYear((y) => y - 1); }}
                className="rounded-md p-1 hover:bg-accent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{viewYear}</span>
              <button
                type="button"
                onClick={() => { setViewYear((y) => y + 1); }}
                className="rounded-md p-1 hover:bg-accent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((name, i) => {
                const monthNum = i + 1;
                const isSelected = value !== '' && monthNum === initialMonth && viewYear === initialYear;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { handleSelect(monthNum); }}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
