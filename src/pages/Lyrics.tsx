import  { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit, RefreshCw, Save, Copy, Music, Volume2 } from 'lucide-react';
import { LyricsTheme } from '../types';
import { useStore } from '../store/useStore';
import { generateLyrics } from '../services/mistralAPI';

const Lyrics = () => {
  const { 
    addNotification, 
    generationParams, 
    updateGenerationParams, 
    speakText, 
    stopSpeech 
  } = useStore();
  
  const [generating, setGenerating] = useState(false);
  const [lyricsTheme, setLyricsTheme] = useState<LyricsTheme>('love');
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const lyricsRef = useRef<HTMLTextAreaElement>(null);
  
  const themes: { value: LyricsTheme; label: string }[] = [
    { value: 'love', label: 'Love' },
    { value: 'nature', label: 'Nature' },
    { value: 'journey', label: 'Journey' },
    { value: 'future', label: 'Future' },
    { value: 'hope', label: 'Hope' },
    { value: 'urban', label: 'Urban' },
    { value: 'freedom', label: 'Freedom' },
    { value: 'loss', label: 'Loss' },
    { value: 'power', label: 'Power' },
    { value: 'change', label: 'Change' }
  ];
  
  // When component unmounts, stop any ongoing speech
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeech();
      }
    };
  }, [isSpeaking, stopSpeech]);
  
  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      // Update generation parameters to include the theme
      updateGenerationParams('theme', lyricsTheme);
      
      // Split keywords into array
      const keywordArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      // Store keywords in generation params
      updateGenerationParams('keywords', keywordArray);
      
      // Generate lyrics with Mistral AI
      const generatedLyrics = await generateLyrics(
        lyricsTheme,
        keywordArray,
        generationParams.genre,
        generationParams.mood
      );
      
      setLyrics(generatedLyrics);
      updateGenerationParams('lyrics', true);
      addNotification('success', 'Lyrics generated successfully with Mistral AI!', 3000);
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
      addNotification('error', 'Failed to generate lyrics. Please try again.', 5000);
    } finally {
      setGenerating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Focus the textarea after it's rendered
    setTimeout(() => {
      if (lyricsRef.current) {
        lyricsRef.current.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    addNotification('success', 'Lyrics saved', 2000);
  };

  const handleCopy = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics);
      addNotification('info', 'Lyrics copied to clipboard', 2000);
    }
  };

  const handleUseInTrack = () => {
    if (lyrics) {
      updateGenerationParams('lyrics', true);
      addNotification('success', 'Lyrics will be used in your next track', 3000);
    }
  };
  
  const handleSpeakLyrics = async () => {
    if (!lyrics) return;
    
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speakText(lyrics);
        // Speech synthesis might have its own onEnd callback
        // but we'll set isSpeaking to false after a reasonable timeout
        setTimeout(() => setIsSpeaking(false), lyrics.length * 50);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Lyrics Generator</h1>
        <p className="text-gray-400 mb-6">Create original lyrics with Mistral AI</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Theme
        </label>
        <div className="grid grid-cols-5 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setLyricsTheme(theme.value)}
              className={`p-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                lyricsTheme === theme.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Keywords (separate with commas)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="input-field"
          placeholder="e.g., dreams, ocean, memories"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6"
      >
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary flex items-center justify-center"
        >
          {generating ? (
            <>
              <RefreshCw className="mr-2 animate-spin" size={18} />
              Generating with Mistral AI...
            </>
          ) : (
            <>
              <FileText className="mr-2" size={18} />
              Generate Lyrics
            </>
          )}
        </button>
      </motion.div>

      {lyrics && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-800 rounded-lg"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="font-medium text-white capitalize">
              {lyricsTheme} Theme Lyrics
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={handleSpeakLyrics}
                className={`${isSpeaking ? 'text-indigo-400' : 'text-gray-400'} hover:text-indigo-300 p-1.5 rounded`}
                title={isSpeaking ? "Stop speaking" : "Speak lyrics"}
              >
                <Volume2 size={18} />
              </button>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-white p-1.5 rounded"
                title="Copy lyrics"
              >
                <Copy size={18} />
              </button>
              {isEditing ? (
                <button 
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-300 p-1.5 rounded"
                  title="Save lyrics"
                >
                  <Save size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-white p-1.5 rounded"
                  title="Edit lyrics"
                >
                  <Edit size={18} />
                </button>
              )}
            </div>
          </div>
          
          <div className="p-4">
            {isEditing ? (
              <textarea
                ref={lyricsRef}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 rounded p-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <pre className="text-gray-300 whitespace-pre-wrap font-sans overflow-auto max-h-[400px]">
                {lyrics}
              </pre>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleUseInTrack}
              className="btn-primary flex items-center justify-center"
            >
              <Music className="mr-2" size={18} />
              Use for Next Track
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Lyrics;
 