
export interface Fruit {
  id: string;
  name: string;
  emoji: string;
  value: number;
  description: string;
  color: string;
}

export interface Participant {
  id: string;
  name: string;
  vote: string | null;
  isAI: boolean;
  avatar: string;
  isOnline?: boolean;
}

export interface SessionState {
  roomId: string;
  storyTitle: string;
  storyDescription: string;
  isRevealed: boolean;
  participants: Participant[];
}

export interface AIInsight {
  suggestedFruit: string;
  reasoning: string;
}

export interface SharedRoomState {
  votes: Record<string, string | null>; // userId -> fruitId
  isRevealed: boolean;
  storyTitle: string;
  storyDescription: string;
  participants: Participant[]; // Sync participants across clients
}
