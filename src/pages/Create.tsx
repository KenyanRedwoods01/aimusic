import  { useState, useEffect } from 'react';
import { Music, Loader, Sliders, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Genre, Mood } from '../types';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import AudioVisualizer from '../components/ui/AudioVisualizer';

const Create = () => {
  const {
    generationParams,
    updateGenerationParams,
    isGenerating,
    generationProgress,
    generateTrack,
  } = useStore();
  
  const navigate = useNavigate();
  
  const [tempo, setTempo] = useState(generationParams.tempo);
  const [pitch, setPitch] = useState(generationParams.pitch);
  const [duration, setDuration] = useState(generationParams.duration);
  const [complexity, setComplexity] = useState(generationParams.complexity);
  const [includeCustomLyrics, setIncludeCustomLyrics] = useState(generationParams.lyrics);
  
  useEffect(() => {
    // Update the store when local state changes
    updateGenerationParams('tempo', tempo);
    updateGenerationParams('pitch', pitch);
    updateGenerationParams('duration', duration);
    updateGenerationParams('complexity', complexity);
    updateGenerationParams('lyrics', includeCustomLyrics);
  }, [tempo, pitch, duration, complexity, includeCustomLyrics, updateGenerationParams]);
  
  const genreOptions: { value: Genre; label: string; }[] = [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hiphop', label: 'Hip Hop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'classical', label: 'Classical' },
    { value: 'rnb', label: 'R&B' },
    { value: 'country', label: 'Country' },
    { value: 'ambient', label: 'Ambient' },
    { value: 'folk', label: 'Folk' },
    { value: 'metal', label: 'Metal' },
    { value: 'indie', label: 'Indie' }
  ];
  
  const moodOptions: { value: Mood; label: string; }[] = [
    { value: 'energetic', label: 'Energetic' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'uplifting', label: 'Uplifting' },
    { value: 'dark', label: 'Dark' },
    { value: 'dreamy', label: 'Dreamy' },
    { value: 'angry', label: 'Angry' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'dramatic', label: 'Dramatic' }
  ];

  const handleGenerate = () => {
    generateTrack();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const navigateToLyrics = () => {
    navigate('/lyrics');
  };
  
  const navigateToCustomize = () => {
    navigate('/customize');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Create New Track</h1>
        <p className="text-gray-400 mb-6">Generate AI-powered music with custom parameters</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {genreOptions.map((genre) => (
              <button
                key={genre.value}
                onClick={() => updateGenerationParams('genre', genre.value)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  generationParams.genre === genre.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mood
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => updateGenerationParams('mood', mood.value)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  generationParams.mood === mood.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Tempo: {tempo} BPM
            </label>
            <span className="text-xs text-gray-500">60-180 BPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="custom-range"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Pitch Adjustment: {pitch > 0 ? `+${pitch}` : pitch}
            </label>
            <span className="text-xs text-gray-500">-12 to +12 semitones</span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            value={pitch}
            onChange={(e) => setPitch(parseInt(e.target.value))}
            className="custom-range"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Duration: {formatDuration(duration)}
            </label>
            <span className="text-xs text-gray-500">30s - 5min</span>
          </div>
          <input
            type="range"
            min="30"
            max="300"
            step="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="custom-range"
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Complexity: {complexity}%
            </label>
            <span className="text-xs text-gray-500">Simple to Complex</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={complexity}
            onChange={(e) => setComplexity(parseInt(e.target.value))}
            className="custom-range"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 py-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="generateLyrics" 
                checked={includeCustomLyrics}
                onChange={(e) => setIncludeCustomLyrics(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 text-indigo-600 focus:ring-indigo-500 bg-gray-800" 
              />
              <label htmlFor="generateLyrics" className="ml-2 text-sm font-medium text-gray-300">
                Include custom lyrics
              </label>
            </div>
            
            {includeCustomLyrics && (
              <button
                onClick={navigateToLyrics}
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
              >
                <FileText className="mr-1" size={14} />
                Generate lyrics
              </button>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex space-x-3 pt-3"
        >
          <button 
            onClick={navigateToCustomize}
            className="btn-secondary flex items-center justify-center flex-1"
          >
            <Sliders className="mr-2" size={18} />
            Advanced
          </button>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary flex items-center justify-center flex-1"
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin mr-2" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Music className="mr-2" size={18} />
                Generate Music
              </>
            )}
          </button>
        </motion.div>
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 bg-gray-800 rounded-lg text-center"
        >
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3"
              alt="Music studio" 
              className="w-full h-48 rounded-lg object-cover mb-4 opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <AudioVisualizer isPlaying={true} barCount={24} />
            </div>
          </div>
          
          <p className="text-gray-300 mb-2">AI is composing a {generationParams.genre} track in {generationParams.mood} mood</p>
          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300" 
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{Math.round(generationProgress)}% complete</p>
        </motion.div>
      )}
    </div>
  );
};

export default Create;
 