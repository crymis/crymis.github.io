
import React from 'react';
import { Participant, Fruit } from '../types';
import { FRUITS } from '../constants';

interface ParticipantListProps {
  participants: Participant[];
  isRevealed: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, isRevealed }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
        <i className="fas fa-users text-blue-500"></i>
        The Salad Bowl
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {participants.map((p) => {
          const selectedFruit = FRUITS.find(f => f.id === p.vote);
          return (
            <div key={p.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border-2 border-gray-100" />
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-1">
                    {p.name}
                    {p.isAI && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1 rounded uppercase tracking-tighter">AI</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    {p.vote ? 'Ready' : 'Thinking...'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                {p.vote ? (
                  isRevealed ? (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-inner ${selectedFruit?.color}`}>
                      {selectedFruit?.emoji}
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white animate-pulse">
                      <i className="fas fa-leaf"></i>
                    </div>
                  )
                ) : (
                  <div className="w-12 h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300">
                    <i className="fas fa-clock text-xs"></i>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantList;
