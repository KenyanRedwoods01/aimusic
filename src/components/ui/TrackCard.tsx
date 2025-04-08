import  { Play, Pause, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { GeneratedTrack } from '../../types';
import AudioVisualizer from './AudioVisualizer';

interface TrackCardProps {
  track: GeneratedTrack;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
}

const TrackCard = ({ track, isPlaying, onPlay, onDelete }: TrackCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-4">
          <button 
            onClick={onPlay}
            className="bg-indigo-600 rounded-full h-12 w-12 flex items-center justify-center hover:bg-indigo-700 transition-colors"
            aria-label={isPlaying ? "Pause track" : "Play track"}
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white ml-0.5" />
            )}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate text-base">{track.title}</h3>
          <div className="flex items-center text-gray-400 text-sm mt-1">
            <span className="capitalize">{track.genre}</span>
            <span className="mx-2">•</span>
            <span>{formatDuration(track.duration)}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-500 text-xs">{formatDate(track.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 ml-2">
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Download track"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Delete track"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {track.waveform && (
        <div className="px-4 pb-3">
          <AudioVisualizer 
            data={track.waveform} 
            isPlaying={isPlaying}
            barCount={48}
          />
        </div>
      )}
    </motion.div>
  );
};

export default TrackCard;
 