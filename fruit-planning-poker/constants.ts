
import { Fruit } from './types';

export const FRUITS: Fruit[] = [
  {
    id: 'grape',
    name: 'Grape',
    emoji: '🍇',
    value: 1,
    description: "Trivial, quick, and requires minimal thought – a no-brainer.",
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍏',
    value: 2,
    description: "Familiar task, but might take a bit of time. You know what's involved, but there may be nuances.",
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    id: 'cherry',
    name: 'Cherry',
    emoji: '🍒',
    value: 3,
    description: "Relatively easy but may have a pesky pit in the middle. Most is known, but some unknowns to consider.",
    color: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    emoji: '🍍',
    value: 5,
    description: "Requires exploration. Not an everyday occurrence; aspects of the task to figure out.",
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    value: 8,
    description: "The wild card. Multiple challenges and uncertainties. Might need a metaphorical machete.",
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    value: 0,
    description: "Does not belong in the salad. Inadequate info or requires further breakdown before estimation.",
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    value: 0,
    description: "Tricky and go bad fast. Difficult to scope due to unpredictable nature or fixed-time chores.",
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];

export const INITIAL_AI_PARTICIPANTS = []; // Bots removed
