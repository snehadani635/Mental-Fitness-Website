import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Wind, Heart, Moon, BookOpen, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const QUOTES = [
  "You are stronger than you think. ✨",
  "It's okay to take a break. 🌿",
  "One breath at a time. 🌊",
  "You are doing your best, and that is enough. 💙",
  "Peace begins with a smile. 😊",
];

const QUESTIONS = [
  { id: 1, text: "Hello! How are you feeling today?" },
  { id: 2, text: "What is the main thing causing you stress right now?" },
  { id: 3, text: "On a scale from 1–10, how stressed do you feel?" },
  { id: 4, text: "Have you slept well recently?" },
  { id: 5, text: "Would you like to talk about what's bothering you?" },
];

const REMEDIES = [
  { title: "Deep Breathing", description: "Take 5 deep breaths to center yourself.", icon: <Wind className="w-6 h-6" />, emoji: "🌬️", color: "bg-blue-100 text-blue-600" },
  { title: "5-Minute Meditation", description: "Clear your mind and focus on the present.", icon: <Moon className="w-6 h-6" />, emoji: "🧘", color: "bg-purple-100 text-purple-600" },
  { title: "Light Stretching", description: "Gently stretch your body to release tension.", icon: <Heart className="w-6 h-6" />, emoji: "🤸", color: "bg-green-100 text-green-600" },
  { title: "Calming Music", description: "Listen to lo-fi or nature sounds.", icon: <Sparkles className="w-6 h-6" />, emoji: "🎵", color: "bg-yellow-100 text-yellow-600" },
  { title: "Journaling", description: "Write down your thoughts and feelings.", icon: <BookOpen className="w-6 h-6" />, emoji: "✍️", color: "bg-pink-100 text-pink-600" },
  { title: "Short Walk", description: "Get some fresh air and move your body.", icon: <Activity className="w-6 h-6" />, emoji: "🌳", color: "bg-orange-100 text-orange-600" },
];

export default function MindEase() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'bot' | 'user' }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [showRemedies, setShowRemedies] = useState(false);
  const [recheckStep, setRecheckStep] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Exhale' | 'Hold'>('Inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(breathInterval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoggedIn(true);
      setMessages([{ text: `Hello ${userName}! Welcome to MindEase. I'm here to listen. 😊`, sender: 'bot' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: QUESTIONS[0].text, sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep < QUESTIONS.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: QUESTIONS[nextStep].text, sender: 'bot' }]);
      }, 1000);
    } else {
      setTimeout(() => {
        analyzeMood();
      }, 1000);
    }
  };

  const analyzeMood = () => {
    setShowAnalysis(true);
    const texts = [
      "It seems you might be feeling stressed today. Let's try some calming activities.",
      "You seem a bit overwhelmed. Taking small steps can help.",
      "It sounds like you're going through a lot. Let's find some peace together.",
      "Your feelings are valid. Let's work on bringing some calm to your day."
    ];
    setAnalysisText(texts[Math.floor(Math.random() * texts.length)]);
    
    setTimeout(() => {
      setShowRemedies(true);
      setMessages(prev => [...prev, { text: "Based on how you're feeling, here are some suggestions for you. Take a look! ✨", sender: 'bot' }]);
    }, 3000);
  };

  const handleRecheck = (status: string) => {
    setRecheckStep(false);
    if (status === 'Better') {
      setMessages(prev => [...prev, { text: "That's great to hear! Remember to take care of yourself. I'm always here if you need me. 💙", sender: 'bot' }]);
    } else {
      setMessages(prev => [...prev, { text: "I'm sorry you're still feeling this way. Why don't we try another activity? Or we can start over.", sender: 'bot' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Would you like to restart our chat? 😊", sender: 'bot' }]);
      }, 1000);
    }
  };

  const restartChat = () => {
    setCurrentStep(0);
    setShowAnalysis(false);
    setShowRemedies(false);
    setRecheckStep(false);
    setMessages([{ text: `Welcome back, ${userName}! Let's start fresh. 😊`, sender: 'bot' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: QUESTIONS[0].text, sender: 'bot' }]);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md border border-white"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">MindEase</h1>
            <p className="text-gray-500">Your Calm Space 🌿</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all" 
                placeholder="Enter your name..." 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              Enter Calm Space ✨
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans selection:bg-indigo-100">
      {/* Floating elements for ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-10 left-10 text-4xl opacity-20"
        >✨</motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-20 right-10 text-4xl opacity-20"
        >🌿</motion.div>
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-1/2 left-1/4 text-4xl opacity-20"
        >🌊</motion.div>
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-1/3 right-1/4 text-4xl opacity-20"
        >💙</motion.div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/60 backdrop-blur-lg z-50 border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-indigo-600">MindEase</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
            <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors">Logout</button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Chatbot Panel */}
        <div className="lg:col-span-5 h-[calc(100vh-12rem)] flex flex-col bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 bg-white/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">MindEase Companion</h2>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={cn(
                    "flex", 
                    msg.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl shadow-sm text-sm",
                    msg.sender === 'user' ? "bg-indigo-500 text-white rounded-tr-none" : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Chat input / Interaction area */}
          <div className="p-4 bg-white/50 border-t border-gray-100">
            {recheckStep ? (
              <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => handleRecheck('Better')} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-2">Better 🙂</button>
                <button onClick={() => handleRecheck('Same')} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors flex items-center gap-2">Same 😐</button>
                <button onClick={() => handleRecheck('Stressed')} className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2">Still Stressed 😔</button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm" 
                  placeholder="Type your response..." 
                  disabled={showRemedies}
                />
                <button 
                  type="submit" 
                  disabled={showRemedies}
                  className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:bg-gray-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
            {showRemedies && !recheckStep && (
              <button 
                onClick={() => setRecheckStep(true)} 
                className="w-full mt-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                How do you feel now? 😊
              </button>
            )}
            {showRemedies && recheckStep && (
               <button 
               onClick={restartChat} 
               className="w-full mt-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition-colors"
             >
               Restart Chat 🔄
             </button>
            )}
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Analysis Popup (Floating Top Right of this section) */}
          <AnimatePresence>
            {showAnalysis && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="bg-indigo-600 text-white p-6 rounded-3xl shadow-2xl shadow-indigo-200 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">Mood Analysis</h3>
                  </div>
                  <p className="text-indigo-100 text-sm leading-relaxed">{analysisText}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <Sparkles className="w-24 h-24" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breathing Exercise */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white text-center relative overflow-hidden">
            <h3 className="text-xl font-bold text-indigo-600 mb-6">Breathing Space 🌊</h3>
            <div className="flex justify-center items-center py-8">
              <motion.div 
                animate={{ 
                  scale: breathingPhase === 'Inhale' ? 1.5 : breathingPhase === 'Hold' ? 1.5 : 1,
                  opacity: breathingPhase === 'Inhale' ? 0.8 : breathingPhase === 'Hold' ? 0.8 : 0.4,
                }} 
                transition={{ duration: 4, ease: "easeInOut" }} 
                className="w-24 h-24 bg-indigo-300 rounded-full blur-xl absolute"
              />
              <motion.div 
                animate={{ 
                  scale: breathingPhase === 'Inhale' ? 1.5 : breathingPhase === 'Hold' ? 1.5 : 1,
                }} 
                transition={{ duration: 4, ease: "easeInOut" }} 
                className="w-24 h-24 bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10 shadow-lg shadow-indigo-200"
              >
                {breathingPhase}
              </motion.div>
            </div>
            <p className="text-gray-500 text-sm mt-4 italic">Follow the circle to relax your mind...</p>
          </div>

          {/* Suggestions & Remedies */}
          <AnimatePresence>
            {showRemedies && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                  Recommended for You ✨
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REMEDIES.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02 }} 
                      className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-start gap-4 transition-all hover:shadow-md"
                    >
                      <div className={cn("p-3 rounded-xl", item.color)}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{item.title}</span>
                          <span>{item.emoji}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Daily Quote */}
          <div className="bg-indigo-100/50 p-6 rounded-3xl border border-indigo-200 text-center">
            <span className="text-2xl mb-2 block">✨</span>
            <motion.p 
              key={quote}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-lg italic font-medium text-indigo-700"
            >
              "{quote}"
            </motion.p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-indigo-100 text-center text-gray-500 text-sm">
        <p className="font-medium text-gray-600">Created by Mohit, Sneha, and Vidit</p>
        <p>Team Alpha Builders </p>
      </footer>
    </div>
  );
}
