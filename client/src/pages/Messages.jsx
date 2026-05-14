import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, Search, MoreVertical, 
  User, Check, CheckCheck, Loader2,
  Video, Phone, Info, Smile, ArrowLeft,
  MessageCircle, Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io(window.location.origin.replace('5173', '5000').replace('5175', '5000'));
    socket.current.emit('join', user._id);

    socket.current.on('message', (msg) => {
      if (activeChat && (msg.senderId === activeChat._id || msg.receiverId === activeChat._id)) {
        setMessages(prev => [...prev, msg]);
      }
      fetchConversations();
    });

    return () => socket.current.disconnect();
  }, [activeChat, user._id]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      if (user?.role === 'doctor') {
        setConversations([
          { _id: 'p1', name: 'Rajesh Kumar', role: 'Patient', lastMsg: 'I am feeling much better, doctor. The fever is gone.', time: '09:05 AM', unread: 1, online: true },
          { _id: 'p2', name: 'Sita Devi', role: 'Patient', lastMsg: 'Should I continue the meds?', time: 'Yesterday', unread: 0, online: false },
          { _id: 'p3', name: 'Ramesh Patel', role: 'Patient', lastMsg: 'Thanks for the prescription.', time: 'Monday', unread: 0, online: true },
        ]);
      } else {
        setConversations([
          { _id: 'd1', name: 'Dr. Rajesh Sharma', role: 'Cardiologist', lastMsg: 'Please take the meds on time.', time: '10:30 AM', unread: 2, online: true },
          { _id: 'd2', name: 'Dr. Anita Verma', role: 'Gynecologist', lastMsg: 'The reports look normal.', time: 'Yesterday', unread: 0, online: false },
          { _id: 'd3', name: 'Dr. Vikram Singh', role: 'Pediatrician', lastMsg: 'See you next Tuesday.', time: 'Monday', unread: 0, online: true },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId) => {
    setLoading(true);
    try {
      if (user?.role === 'doctor') {
        setMessages([
          { _id: 'm1', senderId: user._id, text: 'Hello Rajesh, how are you feeling today?', time: '09:00 AM' },
          { _id: 'm2', senderId: contactId, text: 'I am feeling much better, doctor. The fever is gone.', time: '09:05 AM' },
        ]);
      } else {
        setMessages([
          { _id: 'm1', senderId: contactId, text: 'Hello, how are you feeling today?', time: '09:00 AM' },
          { _id: 'm2', senderId: user._id, text: 'I am feeling much better, doctor. The fever is gone.', time: '09:05 AM' },
          { _id: 'm3', senderId: contactId, text: 'That is great news! Continue the medication for 2 more days.', time: '09:10 AM' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgData = {
      senderId: user._id,
      receiverId: activeChat._id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.current.emit('sendMessage', msgData);
    setMessages(prev => [...prev, msgData]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-160px)] bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden flex">
      {/* Chat Sidebar */}
      <motion.div 
        animate={{ width: showSidebar ? 360 : 0, opacity: showSidebar ? 1 : 0 }}
        className="border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50"
      >
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search doctors..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-8">
          {conversations.map((chat) => (
            <button
              key={chat._id}
              onClick={() => { setActiveChat(chat); fetchMessages(chat._id); if (window.innerWidth < 768) setShowSidebar(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all group ${activeChat?._id === chat._id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'hover:bg-white dark:hover:bg-slate-800'}`}
            >
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
                {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-black uppercase tracking-tight truncate ${activeChat?._id === chat._id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{chat.name}</h4>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeChat?._id === chat._id ? 'text-white/60' : 'text-slate-400'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-[10px] font-bold truncate ${activeChat?._id === chat._id ? 'text-white/80' : 'text-slate-500'}`}>{chat.lastMsg}</p>
                  {chat.unread > 0 && activeChat?._id !== chat._id && (
                    <span className="bg-primary text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg">{chat.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950/20">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowSidebar(true)} className="md:hidden p-2 text-slate-400 hover:text-primary">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  {activeChat.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{activeChat.name}</h3>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> {activeChat.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] space-y-1 ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm ${
                        msg.senderId === user._id 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                    <div className="flex items-center gap-1.5 px-2">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">{msg.time}</span>
                      {msg.senderId === user._id && <CheckCheck className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Message Input */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <button type="button" className="p-4 text-slate-400 hover:text-primary transition-colors">
                  <Smile className="w-6 h-6" />
                </button>
                <button type="button" className="p-4 text-slate-400 hover:text-primary transition-colors">
                  <Paperclip className="w-6 h-6" />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to the doctor..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 dark:text-white py-4"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-14 h-14 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-[3rem] flex items-center justify-center text-slate-200 mb-8 shadow-inner">
              <MessageCircle className="w-16 h-16" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Your Inbox</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-sm mx-auto leading-relaxed">Select a doctor from the list to start a real-time consultation chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
