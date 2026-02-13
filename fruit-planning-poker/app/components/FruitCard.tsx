
import React from 'react';
import { Fruit } from '../types';

interface FruitCardProps {
  fruit: Fruit;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const FruitCard: React.FC<FruitCardProps> = ({ fruit, isSelected, onSelect, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onSelect(fruit.id)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
        w-28 h-40 md:w-32 md:h-48
        ${isSelected 
          ? 'scale-110 -translate-y-4 border-yellow-400 shadow-xl ring-4 ring-yellow-200 z-10' 
          : 'border-white bg-white shadow-md hover:shadow-lg hover:-translate-y-2'}
        ${disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="text-5xl md:text-6xl mb-4">{fruit.emoji}</div>
      <div className="text-sm md:text-base font-bold text-gray-700 text-center px-1 leading-tight">
        {fruit.name}
      </div>
      
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md animate-bounce">
          <i className="fas fa-check text-sm"></i>
        </div>
      )}
    </button>
  );
};

export default FruitCard;
