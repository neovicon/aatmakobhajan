import React from 'react';
import { Type } from 'lucide-react';
import { useFontStore } from '../../store/fontStore';

const sizes = [
  { id: 'text-base', name: 'Small' },
  { id: 'text-lg', name: 'Medium' },
  { id: 'text-xl', name: 'Large' },
  { id: 'text-2xl', name: 'Extra Large' },
];

const FontSizeSwitcher = () => {
  const { fontSize, setFontSize } = useFontStore();

  return (
    <div className="flex items-center gap-2">
      <Type size={16} className="text-gray-500 dark:text-gray-400" />
      <select
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
        className="bg-gray-100 dark:bg-dark-700 border-none text-sm rounded-lg focus:ring-primary-500 py-1 pl-3 pr-8 text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        {sizes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSizeSwitcher;
