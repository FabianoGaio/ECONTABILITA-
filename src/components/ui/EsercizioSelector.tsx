'use client';

import { getEserciziOptions } from '@/lib/utils';

interface Props {
  value: number;
  onChange: (esercizio: number) => void;
}

export default function EsercizioSelector({ value, onChange }: Props) {
  const options = getEserciziOptions();

  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="select-field w-auto"
    >
      {options.map((anno) => (
        <option key={anno} value={anno}>
          Esercizio {anno}
        </option>
      ))}
    </select>
  );
}
