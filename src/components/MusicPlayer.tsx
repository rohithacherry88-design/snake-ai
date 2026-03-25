import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Cybernetic Drift",
    artist: "AI Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "AI Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-cyan-400 font-bold text-xl tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-200/60 text-sm">{currentTrack.artist}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-cyan-950/50 flex items-center justify-center border border-cyan-500/50 relative overflow-hidden">
           {isPlaying && (
             <div className="absolute inset-0 bg-cyan-500/20 animate-pulse"></div>
           )}
           <div className="flex gap-1 items-end h-4">
             <div className={`w-1 bg-cyan-400 rounded-t-sm ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '0ms' }}></div>
             <div className={`w-1 bg-cyan-400 rounded-t-sm ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-2'}`} style={{ animationDelay: '200ms' }}></div>
             <div className={`w-1 bg-cyan-400 rounded-t-sm ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '400ms' }}></div>
           </div>
        </div>
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="text-cyan-500/70 hover:text-cyan-400 transition-colors p-2"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all p-2"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105"
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={playNext}
            className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all p-2"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-9"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
}
