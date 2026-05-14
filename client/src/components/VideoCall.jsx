import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Maximize2, MessageSquare } from 'lucide-react';

const VideoCall = ({ doctorName = 'Dr. Aarav Sharma', onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Simulate connection delay
    const connectTimer = setTimeout(() => setIsConnected(true), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnected]);

  // Request camera access for local preview
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        console.log('Camera access denied or unavailable');
      });

    return () => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Remote Video (Doctor) */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
        {!isConnected ? (
          <div className="text-center text-white">
            <div className="w-20 h-20 rounded-full bg-slate-800 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Phone size={32} className="text-green-400" />
            </div>
            <p className="text-xl font-bold">Connecting to {doctorName}...</p>
            <p className="text-slate-400 text-sm mt-2">Please wait while we establish a secure connection.</p>
          </div>
        ) : (
          <div className="text-center text-white">
            <div className="w-32 h-32 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrSharma" className="w-full h-full rounded-full" alt="Doctor" />
            </div>
            <p className="text-lg font-bold">{doctorName}</p>
            <p className="text-green-400 text-sm mt-1 font-semibold">Connected • {formatTime(callDuration)}</p>
          </div>
        )}

        {/* Local Video (Patient) - PiP */}
        <div className="absolute bottom-6 right-6 w-40 h-28 md:w-56 md:h-40 bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <VideoOff size={24} />
            </div>
          ) : (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          )}
        </div>

        {/* Call Info */}
        <div className="absolute top-6 left-6 flex items-center gap-3 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full text-white">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-orange-400 animate-pulse'}`} />
          <span className="text-sm font-bold">{isConnected ? 'In Call' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900 border-t border-slate-800 px-8 py-6">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          <ControlButton 
            icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />} 
            onClick={() => setIsMuted(!isMuted)}
            active={!isMuted}
            label={isMuted ? 'Unmute' : 'Mute'}
          />
          <ControlButton 
            icon={isVideoOff ? <VideoOff size={22} /> : <Video size={22} />} 
            onClick={() => setIsVideoOff(!isVideoOff)}
            active={!isVideoOff}
            label={isVideoOff ? 'Camera On' : 'Camera Off'}
          />
          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-900/30 hover:bg-red-700 transition-all"
          >
            <PhoneOff size={24} />
          </button>
          <ControlButton icon={<MessageSquare size={22} />} label="Chat" />
          <ControlButton icon={<Maximize2 size={22} />} label="Fullscreen" />
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon, onClick, active = true, label }) => (
  <button
    onClick={onClick}
    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
      active ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-700 text-slate-400'
    }`}
    title={label}
  >
    {icon}
  </button>
);

export default VideoCall;
