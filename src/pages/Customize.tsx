import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Music, RotateCcw, Save } from 'lucide-react';
import { useStore } from '../store/useStore';

const Customize = () => {
  const { 
    generationParams, 
    updateGenerationParams, 
    updateInstrumentVolume, 
    resetGenerationParams,
    addNotification
  } = useStore();
  
  const [instrumentMix, setInstrumentMix] = useState({ ...generationParams.instrumentMix });
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    // Check if the instrument mix has changed
    const instrumentKeys = Object.keys(instrumentMix);
    const hasInstrumentChanges = instrumentKeys.some(key => 
      instrumentMix[key] !== generationParams.instrumentMix[key]
    );
    
    setHasChanges(hasInstrumentChanges);
  }, [instrumentMix, generationParams.instrumentMix]);
  
  const handleInstrumentChange = (instrument: string, value: number) => {
    setInstrumentMix(prev => ({
      ...prev,
      [instrument]: value
    }));
  };
  
  const handleApply = () => {
    // Update all instrument volumes in the store
    Object.entries(instrumentMix).forEach(([instrument, volume]) => {
      updateInstrumentVolume(instrument, volume);
    });
    
    addNotification('success', 'Sound customizations applied', 2000);
    setHasChanges(false);
  };
  
  const handleReset = () => {
    resetGenerationParams();
    setInstrumentMix({ ...generationParams.instrumentMix });
    addNotification('info', 'Settings reset to defaults', 2000);
  };
  
  const instruments = [
    { id: 'drums', label: 'Drums', icon: '🥁' },
    { id: 'bass', label: 'Bass', icon: '🎸' },
    { id: 'guitar', label: 'Guitar', icon: '🎸' },
    { id: 'piano', label: 'Piano', icon: '🎹' },
    { id: 'strings', label: 'Strings', icon: '🎻' },
    { id: 'synth', label: 'Synth', icon: '🎛️' },
    { id: 'vocals', label: 'Vocals', icon: '🎤' }
  ];
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Customize Sound</h1>
        <p className="text-gray-400 mb-6">Fine-tune your music parameters</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Instrument Focus
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['balanced', 'vocals', 'instrumental'].map((focus) => (
            <button
              key={focus}
              onClick={() => updateGenerationParams('instrumentFocus', focus as any)}
              className={`p-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                generationParams.instrumentFocus === focus
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {focus}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-5 mb-8"
      >
        <div className="flex justify-between items-center">
          <label className="block text-base font-medium text-white">
            Instrument Mix
          </label>
          <button 
            className="text-gray-400 hover:text-white text-sm flex items-center"
            onClick={() => setInstrumentMix({ ...generationParams.instrumentMix })}
            disabled={!hasChanges}
          >
            <RotateCcw size={14} className="mr-1" />
            Reset Mix
          </button>
        </div>
        
        {instruments.map((instrument) => (
          <div key={instrument.id} className="space-y-2 bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2 text-xl">{instrument.icon}</span>
                <span className="text-gray-300">{instrument.label}</span>
              </div>
              <span className="text-gray-400 tabular-nums">
                {instrumentMix[instrument.id] || 0}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={instrumentMix[instrument.id] || 0}
              onChange={(e) => handleInstrumentChange(instrument.id, parseInt(e.target.value))}
              className="custom-range"
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex space-x-3"
      >
        <button 
          onClick={handleReset}
          className="btn-secondary flex-1 flex items-center justify-center"
        >
          <RotateCcw className="mr-2" size={18} />
          Reset All
        </button>
        <button 
          onClick={handleApply}
          className={`btn-primary flex-1 flex items-center justify-center ${!hasChanges ? 'opacity-70' : ''}`}
          disabled={!hasChanges}
        >
          <Save className="mr-2" size={18} />
          Apply
        </button>
      </motion.div>
    </div>
  );
};

export default Customize;
 