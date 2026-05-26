import React from 'react';
import { Type } from 'lucide-react';
import { useFontStore } from '../../store/fontStore';

const fonts = [
  { id: 'devanagari', name: 'Noto Sans Devanagari' },
  { id: 'mukta', name: 'Mukta' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'roboto', name: 'Roboto' },
];

const FontSwitcher = () => {
  const { font, setFont } = useFontStore();

  return (
    <div className="flex items-center gap-2">
      <Type size={16} className="text-gray-500 dark:text-gray-400" />
      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="bg-gray-100 dark:bg-dark-700 border-none text-sm rounded-lg focus:ring-primary-500 py-1 pl-3 pr-8 text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        {fonts.map((f) => (
          <option key={f.id} value={f.id} className={`font-${f.id}`}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSwitcher;
