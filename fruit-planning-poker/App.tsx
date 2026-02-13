
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, onDisconnect } from 'firebase/database';
import { FRUITS } from './constants';
import { SessionState, Participant, AIInsight, Fruit } from './types';
import FruitCard from './components/FruitCard';
import ParticipantList from './components/ParticipantList';
import { getFruitCoachInsight } from './services/geminiService';

// Your unique Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBffCarx-yPEoJwCEOxV63CR4tlKYVWEOI",
  authDomain: "fruit-planning-poker.firebaseapp.com",
  databaseURL: "https://fruit-planning-poker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fruit-planning-poker",
  storageBucket: "fruit-planning-poker.firebasestorage.app",
  messagingSenderId: "1076015123381",
  appId: "1:1076015123381:web:7ca4f64115645add0ce7fc"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

const App: React.FC = () => {
  const [myId] = useState(() => {
    let id = localStorage.getItem('fruit-poker-user-id');
    if (!id) {
      id = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('fruit-poker-user-id', id);
    }
    return id;
  });
  
  const [myName, setMyName] = useState<string | null>(localStorage.getItem('fruit-poker-name'));
  const [showJoinModal, setShowJoinModal] = useState(!myName);
  const [copySuccess, setCopySuccess] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showNewRoundModal, setShowNewRoundModal] = useState(false);

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialRoomId = urlParams.get('room') || 'fresh-harvest';
  
  const decodedStory = useMemo(() => {
    const s = urlParams.get('s');
    if (!s) return null;
    try { return JSON.parse(atob(s)); } catch { return null; }
  }, [urlParams]);

  const [session, setSession] = useState<SessionState>({
    roomId: initialRoomId,
    storyTitle: decodedStory?.title || 'Main Course',
    storyDescription: decodedStory?.desc || 'What are we cooking up today?',
    isRevealed: false,
    participants: []
  });

  const roomRef = ref(db, `rooms/${session.roomId}`);

  useEffect(() => {
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        set(roomRef, {
          storyTitle: session.storyTitle,
          storyDescription: session.storyDescription,
          isRevealed: false,
          votes: {},
          participants: {}
        });
        return;
      }

      const participantsMap = data.participants || {};
      const votesMap = data.votes || {};

      const participantsList: Participant[] = Object.keys(participantsMap).map(id => ({
        ...participantsMap[id],
        vote: votesMap[id] || null
      }));

      setSession(prev => ({
        ...prev,
        storyTitle: data.storyTitle || prev.storyTitle,
        storyDescription: data.storyDescription || prev.storyDescription,
        isRevealed: !!data.isRevealed,
        participants: participantsList
      }));
    });

    return () => unsubscribe();
  }, [session.roomId]);

  useEffect(() => {
    if (myName) {
      const participantRef = ref(db, `rooms/${session.roomId}/participants/${myId}`);
      const voteRef = ref(db, `rooms/${session.roomId}/votes/${myId}`);
      
      const me: Partial<Participant> = {
        id: myId,
        name: myName,
        isAI: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${myName}`
      };
      
      set(participantRef, me);
      onDisconnect(participantRef).remove();
      onDisconnect(voteRef).remove();
    }
  }, [myName, myId, session.roomId]);

  const handleVote = (fruitId: string) => {
    if (session.isRevealed) return;
    set(ref(db, `rooms/${session.roomId}/votes/${myId}`), fruitId);
  };

  const handleReveal = () => {
    update(roomRef, { isRevealed: true });
  };

  const handleReset = () => {
    update(roomRef, { isRevealed: false, votes: {} });
    setInsight(null);
  };

  const createNewRound = (title: string, desc: string) => {
    const encoded = btoa(JSON.stringify({ title, desc }));
    const newRoomId = Math.random().toString(36).substr(2, 6);
    window.location.href = `?room=${newRoomId}&s=${encoded}`;
  };

  const shareSession = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const fetchAIInsight = async () => {
    setIsLoadingInsight(true);
    const result = await getFruitCoachInsight(session.storyTitle, session.storyDescription);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  const getConsensus = (): Fruit => {
    const activeVotes = session.participants.filter(p => p.vote).map(p => FRUITS.find(f => f.id === p.vote)!);
    if (activeVotes.length === 0) return FRUITS.find(f => f.id === 'tomato') || FRUITS[0];
    if (activeVotes.some(v => v.id === 'tomato')) return FRUITS.find(f => f.id === 'tomato')!;
    const avocadoCount = activeVotes.filter(v => v.id === 'avocado').length;
    if (avocadoCount > activeVotes.length / 2) return FRUITS.find(f => f.id === 'avocado')!;
    const numericalVotes = activeVotes.filter(v => v.value > 0);
    if (numericalVotes.length === 0) return activeVotes[0];
    const avg = numericalVotes.reduce((a, b) => a + b.value, 0) / numericalVotes.length;
    const numericFruits = FRUITS.filter(f => f.value > 0);
    return numericFruits.reduce((prev, curr) => Math.abs(curr.value - avg) < Math.abs(prev.value - avg) ? curr : prev);
  };

  const myParticipant = session.participants.find(p => p.id === myId);
  const myVote = myParticipant?.vote;
  const consensus = getConsensus();

  const handleLogout = () => {
    localStorage.removeItem('fruit-poker-name');
    window.location.reload();
  };

  if (showJoinModal) {
    return (
      <div className="fixed inset-0 bg-yellow-400 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">🥗</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Ready for the Salad?</h2>
          <p className="text-gray-500 mb-6 font-medium">Join the remote harvest. What's your name?</p>
          <input 
            autoFocus
            type="text"
            placeholder="e.g. Avocado Addict"
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-center text-xl mb-4 text-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const name = (e.target as HTMLInputElement).value;
                if (name) {
                  localStorage.setItem('fruit-poker-name', name);
                  setMyName(name);
                  setShowJoinModal(false);
                }
              }
            }}
          />
          <button 
            onClick={() => {
              const input = document.querySelector('input');
              if (input?.value) {
                localStorage.setItem('fruit-poker-name', input.value);
                setMyName(input.value);
                setShowJoinModal(false);
              }
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all"
          >
            Start Estimating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-3xl shadow-lg transform -rotate-6 transition-transform hover:rotate-0">
            🍍
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Fruit Poker</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium italic text-sm">Room: {session.roomId}</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {myParticipant && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm mr-2">
              <img src={myParticipant.avatar} alt={myParticipant.name} className="w-10 h-10 rounded-full border-2 border-indigo-100" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Profile</span>
                <span className="text-sm font-bold text-gray-800 leading-none">{myParticipant.name}</span>
              </div>
              <button onClick={handleLogout} className="ml-2 text-gray-300 hover:text-red-400 transition-colors"><i className="fas fa-sign-out-alt"></i></button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={shareSession} className="px-6 py-3 rounded-full bg-white border-2 border-gray-100 font-bold text-indigo-600 hover:bg-gray-50 transition-colors shadow-sm">
              {copySuccess ? <span className="text-green-600"><i className="fas fa-check mr-2"></i>Link Copied</span> : <span><i className="fas fa-share-alt mr-2"></i>Share Link</span>}
            </button>
            <button onClick={() => setShowNewRoundModal(true)} className="px-6 py-3 rounded-full bg-indigo-50 border-2 border-indigo-100 font-bold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm">
              <i className="fas fa-plus mr-2"></i>New Round
            </button>
            {!session.isRevealed ? (
              <button onClick={handleReveal} disabled={!myVote} className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg ${myVote ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                <i className="fas fa-eye mr-2"></i>Reveal Cards
              </button>
            ) : (
              <button onClick={handleReset} className="px-8 py-3 rounded-full bg-orange-500 text-white font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2">
                <i className="fas fa-redo"></i>Reset Board
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xs uppercase font-bold text-indigo-500 mb-2 tracking-widest">Active Task</h2>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{session.storyTitle}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{session.storyDescription}</p>
            <button onClick={fetchAIInsight} disabled={isLoadingInsight} className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-orange-500 transition-all shadow-md">
              {isLoadingInsight ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-wand-sparkles"></i>}
              Fruit Coach Insight
            </button>
          </div>

          {insight && (
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 relative overflow-hidden animate-fade-in">
              <h3 className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-tighter">Coach's Pick</h3>
              <p className="text-gray-700 font-medium mb-2">"This feels like a <span className="text-orange-700 font-bold">{insight.suggestedFruit}</span>"</p>
              <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-orange-200 pl-3">{insight.reasoning}</p>
            </div>
          )}

          <ParticipantList participants={session.participants} isRevealed={session.isRevealed} />
        </div>

        <div className="lg:col-span-8 flex flex-col">
          {session.isRevealed ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-[40px] border-4 border-white shadow-inner mb-8 min-h-[400px] animate-fade-in">
              <h2 className="text-2xl font-bold text-indigo-900 mb-8 tracking-tight">The Team's Fruit Salad</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {session.participants.filter(p => p.vote).map(p => {
                  const fruit = FRUITS.find(f => f.id === p.vote);
                  return (
                    <div key={p.id} className="flex flex-col items-center animate-bounce">
                      <div className={`w-24 h-32 rounded-2xl flex flex-col items-center justify-center shadow-xl border-2 bg-white ${fruit?.color}`}>
                        <span className="text-5xl mb-1">{fruit?.emoji}</span>
                        <span className="font-bold text-xs text-gray-500 mt-2 uppercase tracking-widest">{fruit?.name}</span>
                      </div>
                      <span className="mt-2 text-[10px] font-bold text-indigo-700 uppercase tracking-tighter bg-white px-2 rounded-full shadow-sm">{p.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-12 p-10 bg-white rounded-[40px] shadow-2xl flex flex-col items-center text-center max-w-sm border-2 border-indigo-100 relative">
                <div className="absolute -top-4 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Consensus</div>
                <div className="text-8xl mb-4 drop-shadow-lg">{consensus.emoji}</div>
                <div className="text-4xl font-black text-gray-800 tracking-tighter">{consensus.name}</div>
                <p className="mt-4 text-gray-500 text-sm italic font-medium">"{consensus.description}"</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 bg-gray-50 rounded-[40px] border-4 border-white shadow-inner mb-8">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Cast Your Vote</h2>
                  <div className="text-sm bg-white px-4 py-1 rounded-full shadow-sm text-gray-500 font-bold border border-gray-100">
                    {session.participants.filter(p => p.vote).length} / {session.participants.length} Ready
                  </div>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 justify-items-center">
                  {FRUITS.map(fruit => (
                    <FruitCard key={fruit.id} fruit={fruit} isSelected={myVote === fruit.id} onSelect={handleVote} />
                  ))}
               </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-[0.2em]">Fruit Lexicon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FRUITS.map(f => (
                <div key={f.id} className="flex items-start gap-3">
                  <span className="text-3xl">{f.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{f.name}</span>
                    <span className="text-xs text-gray-500 leading-snug">{f.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showNewRoundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-magic text-indigo-500"></i> Start a New Round
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Story Title</label>
                <input id="new-title" type="text" defaultValue="Next Big Thing" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-700" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Description</label>
                <textarea id="new-desc" rows={3} placeholder="Add context for the team..." className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none text-gray-700"></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowNewRoundModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button 
                onClick={() => {
                  const title = (document.getElementById('new-title') as HTMLInputElement).value;
                  const desc = (document.getElementById('new-desc') as HTMLTextAreaElement).value;
                  if (title) createNewRound(title, desc);
                }} 
                className="flex-[2] py-4 px-8 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
              >
                Create Round
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 mb-8 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
        Stay Fresh &bull; Estimate Better &bull; Fruit Poker
      </footer>
    </div>
  );
};

export default App;
