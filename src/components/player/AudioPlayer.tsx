import  { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import AudioVisualizer from '../ui/AudioVisualizer';

const AudioPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    tracks, 
    setCurrentTrack 
  } = useStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle previous track
  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(tracks[currentIndex - 1].id);
    }
  };
  
  // Handle next track
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < tracks.length - 1) {
      setCurrentTrack(tracks[currentIndex + 1].id);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // If we had a real audio element, we would set its volume here
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // If we had a real audio element, we would mute/unmute it here
  };
  
  // Handle timeline interactions
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentTrack) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    setCurrentTime(newTime);
    // If we had a real audio element, we would seek to the new time here
  };
  
  // Simulate playback progress for the demo
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, duration, setIsPlaying]);
  
  // Set duration when track changes
  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.duration);
      setCurrentTime(0); // Reset current time when track changes
    }
  }, [currentTrack]);
  
  if (!currentTrack) return null;
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-16 left-0 right-0 bg-gray-800 bg-opacity-95 backdrop-blur-sm border-t border-gray-700 p-3 z-20"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-2">
          <div 
            ref={progressRef}
            className="h-2 flex-grow bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleTimelineClick}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 ml-2 tabular-nums whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <img 
              src={currentTrack.coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBzdHVkaW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60'}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
          </div>
          
          <div className="flex-grow mr-4">
            <div className="font-medium text-white truncate">{currentTrack.title}</div>
            <div className="text-sm text-gray-400 capitalize truncate">{currentTrack.genre}</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={playPreviousTrack}
              className="text-gray-400 hover:text-white focus:outline-none"
              aria-label="Previous track"
              disabled={tracks.findIndex(track => track.id === currentTrack.id) === 0}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            
            <button 
              onClick={playNextTrack}
              className="text-gray-400 hover:text-white focus:outline-none"
              aria-label="Next track"
              disabled={tracks.findIndex(track => track.id === currentTrack.id) === tracks.length - 1}
            >
              <SkipForward size={20} />
            </button>
            
            <div className="flex items-center">
              <button 
                onClick={toggleMute}
                className="text-gray-400 hover:text-white mr-2 focus:outline-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
        
        {currentTrack.waveform && (
          <div className="pt-2">
            <AudioVisualizer 
              data={currentTrack.waveform}
              isPlaying={isPlaying}
              color="bg-indigo-500"
              barCount={64}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
 