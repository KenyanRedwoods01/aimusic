import  { useState, useEffect } from 'react';
import { Plus, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GeneratedTrack } from '../types';
import { useNavigate } from 'react-router-dom';
import TrackCard from '../components/ui/TrackCard';

const Home = () => {
  const { 
    user, 
    tracks, 
    currentTrack, 
    setCurrentTrack, 
    isPlaying, 
    setIsPlaying,
    deleteTrack,
    addNotification
  } = useStore();
  
  const navigate = useNavigate();
  
  const handlePlay = (trackId: string) => {
    if (currentTrack?.id === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackId);
    }
  };
  
  const handleDelete = (trackId: string) => {
    deleteTrack(trackId);
    addNotification('info', 'Track deleted', 2000);
  };
  
  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-400">Your AI music studio is ready to create</p>
        </div>
        
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 transition-colors"
          aria-label="Create new track"
        >
          <Plus size={20} />
        </button>
      </motion.div>

      {tracks.length > 0 && (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-between mb-6 mt-8"
          >
            <h2 className="text-xl font-semibold">Your Tracks</h2>
            <span className="text-sm text-gray-400">{tracks.length} tracks</span>
          </motion.div>

          <AnimatePresence>
            <div className="space-y-4">
              {tracks.map((track) => (
                <TrackCard 
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  onPlay={() => handlePlay(track.id)}
                  onDelete={() => handleDelete(track.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        </>
      )}
      
      {tracks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center justify-center py-16 mt-4"
        >
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
            <img 
              src="https://images.unsplash.com/photo-1475275166152-f1e8005f9854?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3"
              alt="Music studio" 
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
            />
            <Music size={40} className="mx-auto text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
            <p className="text-gray-400 mb-6">Create your first AI-powered track to get started</p>
            <button
              onClick={handleCreateNew}
              className="btn-primary"
            >
              Create Your First Track
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
 