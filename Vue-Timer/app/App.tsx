
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Bell, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const VueBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[40%] bg-[#42d392]/10 blur-[80px] sm:blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-[#647eff]/10 blur-[80px] sm:blur-[120px] rounded-full" />
    
    <svg className="absolute top-10 right-10 sm:top-20 sm:right-20 w-32 h-32 sm:w-64 sm:h-64 opacity-5 floating-v" viewBox="0 0 100 100">
      <path d="M10 10 L50 90 L90 10" stroke="#42d392" strokeWidth="8" fill="none" />
    </svg>
    <svg className="absolute bottom-20 left-5 sm:bottom-40 sm:left-10 w-24 h-24 sm:w-48 sm:h-48 opacity-5 floating-v" style={{ animationDelay: '-2s' }} viewBox="0 0 100 100">
      <path d="M10 10 L50 90 L90 10" stroke="#647eff" strokeWidth="8" fill="none" />
    </svg>
  </div>
);

const TimeAdjuster: React.FC<{
  value: number;
  max: number;
  label: string;
  onChange: (val: number) => void;
  disabled?: boolean;
}> = ({ value, max, label, onChange, disabled }) => {
  const [inputValue, setInputValue] = useState(value.toString().padStart(2, '0'));

  useEffect(() => {
    setInputValue(value.toString().padStart(2, '0'));
  }, [value]);

  const handleIncrement = () => !disabled && onChange((value + 1) % (max + 1));
  const handleDecrement = () => !disabled && onChange(value === 0 ? max : value - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    const clampedStr = rawVal.slice(-2);
    setInputValue(clampedStr);
    
    if (clampedStr !== '') {
      const num = parseInt(clampedStr, 10);
      onChange(Math.min(num, max));
    }
  };

  const handleBlur = () => {
    setInputValue(value.toString().padStart(2, '0'));
  };

  return (
    <div className="flex flex-col items-center group">
      <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 sm:mb-4 group-hover:text-[#42d392] transition-colors">
        {label}
      </span>
      <button 
        onClick={handleIncrement}
        disabled={disabled}
        className="p-1 sm:p-2 text-gray-600 hover:text-[#42d392] disabled:opacity-0 transition-all duration-300 transform hover:scale-110"
      >
        <ChevronUp size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
      </button>
      
      <div className="relative my-0.5 sm:my-1">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-14 xs:w-16 sm:w-20 bg-transparent text-center text-4xl xs:text-5xl sm:text-6xl font-black tabular-nums 
            vue-text-gradient select-none border-none outline-none focus:ring-0
            ${disabled ? 'cursor-default' : 'cursor-text focus:scale-105 sm:focus:scale-110'}
            transition-transform duration-300
          `}
        />
      </div>

      <button 
        onClick={handleDecrement}
        disabled={disabled}
        className="p-1 sm:p-2 text-gray-600 hover:text-[#42d392] disabled:opacity-0 transition-all duration-300 transform hover:scale-110"
      >
        <ChevronDown size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
      </button>
    </div>
  );
};

const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 190;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="absolute inset-0 -rotate-90 w-full h-full pointer-events-none" viewBox="0 0 500 500">
      <circle
        cx="250"
        cy="250"
        r={radius}
        stroke="rgba(255, 255, 255, 0.03)"
        strokeWidth="8"
        fill="transparent"
      />
      <motion.circle
        cx="250"
        cy="250"
        r={radius}
        stroke="url(#vueGradient)"
        strokeWidth="10"
        fill="transparent"
        strokeLinecap="round"
        style={{ strokeDasharray: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: 'tween', ease: 'linear', duration: 1 }}
      />
      <defs>
        <linearGradient id="vueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#42d392" />
          <stop offset="100%" stopColor="#647eff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [totalInitialSeconds, setTotalInitialSeconds] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [mantra, setMantra] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const showHours = !isRunning || h > 0;

  const fetchMantra = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Generate a short (max 5 words) motivational mantra for a productive focus session. Return only the text without quotes.',
      });
      if (response.text) setMantra(response.text.trim());
    } catch (error) {
      console.error('Gemini error fetching mantra:', error);
    }
  }, []);

  const handleManualAdjust = (type: 'h' | 'm' | 's', val: number) => {
    let newH = h, newM = m, newS = s;
    if (type === 'h') newH = val;
    if (type === 'm') newM = val;
    if (type === 's') newS = val;
    
    const newTotal = newH * 3600 + newM * 60 + newS;
    setTimeLeft(newTotal);
    setTotalInitialSeconds(newTotal);
  };

  const toggleTimer = () => {
    if (timeLeft === 0 && !isRunning) return;
    if (!isRunning) {
      setTotalInitialSeconds(timeLeft);
      fetchMantra();
    } else {
      setMantra('');
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalInitialSeconds);
    setMantra('');
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const progress = totalInitialSeconds > 0 ? (timeLeft / totalInitialSeconds) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#42d392]/30">
      <VueBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center w-full max-w-lg"
      >
        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <div className="bg-[#42d392] p-1.5 sm:p-2 rounded-xl shadow-lg shadow-[#42d392]/20">
            <Clock className="text-[#35495e] w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">
            VueFlow <span className="text-[#42d392]">Timer</span>
          </h1>
        </div>

        <div className="relative p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl flex items-center justify-center w-[95vw] max-w-[450px] aspect-square">
          <ProgressRing progress={progress} />
          
          <AnimatePresence>
            {isRunning && mantra && (
              <motion.div 
                initial={{ opacity: 0, y: 15, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 15, x: '-50%' }}
                className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#42d392]/10 backdrop-blur-xl border border-[#42d392]/30 z-30 whitespace-nowrap shadow-xl shadow-[#42d392]/5"
              >
                <Sparkles size={12} className="text-[#42d392] sm:w-[14px] sm:h-[14px]" />
                <span className="text-[8px] sm:text-[10px] font-bold text-[#42d392] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  {mantra}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-1 sm:gap-4 relative z-10 pt-4 w-full">
            <AnimatePresence mode="popLayout">
              {showHours && (
                <motion.div 
                  key="hours-segment"
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="flex items-center gap-1 sm:gap-4"
                >
                  <TimeAdjuster label="Hours" value={h} max={23} onChange={(v) => handleManualAdjust('h', v)} disabled={isRunning} />
                  <span className="text-2xl sm:text-4xl font-light text-white/10 mt-4 sm:mt-6 self-center pb-1 sm:pb-2">:</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div layout className="flex items-center gap-1 sm:gap-4">
              <TimeAdjuster label="Minutes" value={m} max={59} onChange={(v) => handleManualAdjust('m', v)} disabled={isRunning} />
              <span className="text-2xl sm:text-4xl font-light text-white/10 mt-4 sm:mt-6 self-center pb-1 sm:pb-2">:</span>
              <TimeAdjuster label="Seconds" value={s} max={59} onChange={(v) => handleManualAdjust('s', v)} disabled={isRunning} />
            </motion.div>
          </div>

          <div className="absolute bottom-14 sm:bottom-24 flex flex-col items-center gap-1">
             <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Current Session</span>
             <div className={`h-1 rounded-full transition-all duration-500 ${isRunning ? 'bg-[#42d392] w-10 sm:w-12' : 'bg-gray-800 w-6 sm:w-8'}`} />
          </div>
        </div>

        <div className="mt-10 sm:mt-16 flex items-center gap-4 sm:gap-8 w-full justify-center">
          <button
            onClick={resetTimer}
            className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-500 group"
            title="Reset"
          >
            <RotateCcw size={20} className="sm:w-6 sm:h-6 group-hover:rotate-[-45deg] transition-transform" />
          </button>

          <button
            onClick={toggleTimer}
            className={`
              relative group overflow-hidden
              h-16 sm:h-20 px-8 sm:px-16 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4
              font-bold text-base sm:text-lg tracking-[0.1em] transition-all duration-500
              shadow-2xl hover:scale-105 active:scale-95 flex-1 max-w-[240px]
              ${isRunning 
                ? 'bg-white/10 border border-white/20 text-white' 
                : 'vue-gradient text-[#35495e] shadow-[#42d392]/30'
              }
            `}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative flex items-center justify-center w-full gap-2 sm:gap-4">
              {isRunning ? <Pause size={20} className="sm:w-6 sm:h-6" fill="currentColor" /> : <Play size={20} className="sm:w-6 sm:h-6" fill="currentColor" />}
              <span className="whitespace-nowrap">{isRunning ? 'PAUSE' : 'START FOCUS'}</span>
            </div>
          </button>
          
          <div className="w-12 sm:w-16" /> 
        </div>

        <AnimatePresence>
          {!isRunning && timeLeft === 0 && totalInitialSeconds > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mt-6 sm:mt-8 flex items-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#42d392]/10 border border-[#42d392]/20 text-[#42d392]"
            >
              <Bell size={16} className="sm:w-[18px] sm:h-[18px] animate-bounce" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Session Complete</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="fixed bottom-4 sm:bottom-8 text-white/10 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium flex items-center gap-2">
        <span>VUEFLOW ENGINE</span>
        <div className="w-1 h-1 rounded-full bg-[#42d392]" />
        <span>PRECISION TIMER</span>
      </footer>
    </div>
  );
}
