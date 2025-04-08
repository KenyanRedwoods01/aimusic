import  { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Genre, GeneratedTrack, MusicGenParams, AppNotification, User, Mood } from '../types';
import AudioGenerator from '../services/audioGenerator';
import { generateLyrics, generateTrackTitle } from '../services/mistralAPI';
import speechService from '../services/speechService';

interface AppState {
  // User state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Tracks state
  tracks: GeneratedTrack[];
  currentTrack: GeneratedTrack | null;
  isPlaying: boolean;
  addTrack: (track: GeneratedTrack) => void;
  setCurrentTrack: (trackId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  deleteTrack: (trackId: string) => void;
  
  // Generation params
  generationParams: MusicGenParams;
  updateGenerationParams: <K extends keyof MusicGenParams>(key: K, value: MusicGenParams[K]) => void;
  updateInstrumentVolume: (instrument: string, volume: number) => void;
  resetGenerationParams: () => void;
  
  // Notifications
  notifications: AppNotification[];
  addNotification: (type: 'success' | 'error' | 'info', message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  
  // App state
  isGenerating: boolean;
  generationProgress: number;
  setGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  
  // Audio generation
  generateTrack: () => Promise<void>;
  playTrack: (buffer?: AudioBuffer) => void;
  stopTrack: () => void;
  
  // Speech
  speakText: (text: string) => Promise<void>;
  stopSpeech: () => void;
  
  // Voice recognition
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const DEFAULT_GENERATION_PARAMS: MusicGenParams = {
  genre: 'pop',
  tempo: 120,
  mood: 'energetic',
  lyrics: true,
  duration: 120,
  instrumentFocus: 'balanced',
  pitch: 0,
  complexity: 50,
  instrumentMix: {
    drums: 70,
    bass: 60,
    guitar: 75,
    piano: 65,
    strings: 50,
    synth: 80,
    vocals: 85
  }
};

// Audio context for playback
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const useStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = { 
        id: uuidv4(), 
        name: email.split('@')[0], 
        email,
        createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
      };
      set({ user: mockUser, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      get().addNotification('success', 'Successfully logged in', 3000);
    } catch (error) {
      get().addNotification('error', 'Login failed', 3000);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const mockUser: User = { 
        id: uuidv4(), 
        name, 
        email,
        createdAt: new Date() 
      };
      set({ user: mockUser, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      get().addNotification('success', 'Account created successfully', 3000);
    } catch (error) {
      get().addNotification('error', 'Signup failed', 3000);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
    get().addNotification('info', 'You have been logged out', 3000);
  },
  
  // Tracks state
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  
  addTrack: (track) => set((state) => ({ 
    tracks: [track, ...state.tracks] 
  })),
  
  setCurrentTrack: (trackId) => set((state) => {
    // Stop current playback if any
    if (currentSource) {
      currentSource.stop();
      currentSource = null;
    }
    
    const track = trackId ? state.tracks.find(t => t.id === trackId) || null : null;
    
    // Start playing new track if it has an audio buffer
    if (track && track.audioBuffer) {
      get().playTrack(track.audioBuffer);
    }
    
    return { 
      currentTrack: track,
      isPlaying: !!track
    };
  }),
  
  setIsPlaying: (isPlaying) => {
    if (isPlaying) {
      // Resume playback
      if (get().currentTrack?.audioBuffer) {
        get().playTrack(get().currentTrack.audioBuffer);
      }
    } else {
      // Pause playback
      get().stopTrack();
    }
    
    set({ isPlaying });
  },
  
  deleteTrack: (trackId) => set((state) => {
    const newTracks = state.tracks.filter(t => t.id !== trackId);
    const newCurrentTrack = state.currentTrack?.id === trackId ? null : state.currentTrack;
    
    // Stop playback if deleting the current track
    if (state.currentTrack?.id === trackId) {
      get().stopTrack();
    }
    
    return { 
      tracks: newTracks,
      currentTrack: newCurrentTrack,
      isPlaying: newCurrentTrack ? state.isPlaying : false
    };
  }),
  
  // Generation params
  generationParams: DEFAULT_GENERATION_PARAMS,
  
  updateGenerationParams: (key, value) => set((state) => ({
    generationParams: {
      ...state.generationParams,
      [key]: value
    }
  })),
  
  updateInstrumentVolume: (instrument, volume) => set((state) => ({
    generationParams: {
      ...state.generationParams,
      instrumentMix: {
        ...state.generationParams.instrumentMix,
        [instrument]: volume
      }
    }
  })),
  
  resetGenerationParams: () => set({ generationParams: DEFAULT_GENERATION_PARAMS }),
  
  // Notifications
  notifications: [],
  
  addNotification: (type, message, duration = 5000) => {
    const id = uuidv4();
    set((state) => ({
      notifications: [...state.notifications, { id, type, message, duration }]
    }));
    
    if (duration) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  // App state
  isGenerating: false,
  generationProgress: 0,
  
  setGenerating: (generating) => set({ 
    isGenerating: generating,
    generationProgress: generating ? 0 : 100
  }),
  
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  
  // Audio generation
  generateTrack: async () => {
    const { 
      generationParams, 
      setGenerating, 
      setGenerationProgress, 
      addTrack, 
      addNotification 
    } = get();
    
    setGenerating(true);
    
    try {
      // Generate title with Mistral
      const title = await generateTrackTitle(
        generationParams.genre, 
        generationParams.mood, 
        generationParams.theme
      );
      
      // Generate lyrics if enabled
      let lyrics = undefined;
      if (generationParams.lyrics && generationParams.theme) {
        lyrics = await generateLyrics(
          generationParams.theme,
          generationParams.keywords || [],
          generationParams.genre,
          generationParams.mood
        );
      }
      
      // Generate audio
      const { buffer, waveform } = await AudioGenerator.generateMusic({
        ...generationParams,
        onProgress: setGenerationProgress
      });
      
      // Cover art selection based on genre and mood
      const coverImages = [
        'https://images.unsplash.com/photo-1558811916-51c8d56d29c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200',
        'https://images.unsplash.com/photo-1475275166152-f1e8005f9854?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200'
      ];
      
      // Create the track object
      const newTrack: GeneratedTrack = {
        id: uuidv4(),
        title: title || `${generationParams.genre} ${generationParams.mood} track`,
        genre: generationParams.genre,
        duration: generationParams.duration,
        createdAt: new Date(),
        audioBuffer: buffer,
        waveform,
        lyrics,
        coverArt: coverImages[Math.floor(Math.random() * coverImages.length)],
        params: { ...generationParams }
      };
      
      // Add track to store
      addTrack(newTrack);
      addNotification('success', 'Track generated successfully!', 3000);
      
      // Auto-play the generated track
      get().playTrack(buffer);
      set({ currentTrack: newTrack, isPlaying: true });
      
    } catch (error) {
      console.error('Error generating track:', error);
      addNotification('error', 'Failed to generate track. Please try again.', 5000);
    } finally {
      setGenerating(false);
    }
  },
  
  playTrack: (buffer) => {
    try {
      // Stop current playback if any
      if (currentSource) {
        currentSource.stop();
        currentSource = null;
      }
      
      // Create audio context if it doesn't exist
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (buffer) {
        // Create a new source
        currentSource = audioContext.createBufferSource();
        currentSource.buffer = buffer;
        currentSource.connect(audioContext.destination);
        
        // When playback ends
        currentSource.onended = () => {
          set({ isPlaying: false });
          currentSource = null;
        };
        
        // Start playback
        currentSource.start();
        set({ isPlaying: true });
      }
    } catch (error) {
      console.error('Error playing track:', error);
      get().addNotification('error', 'Failed to play track', 3000);
    }
  },
  
  stopTrack: () => {
    if (currentSource) {
      currentSource.stop();
      currentSource = null;
    }
    set({ isPlaying: false });
  },
  
  // Speech synthesis
  speakText: async (text) => {
    try {
      await speechService.speakText(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        onStart: () => {
          // Speech started callback
        },
        onEnd: () => {
          // Speech ended callback
        }
      });
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      get().addNotification('error', 'Speech synthesis failed', 3000);
    }
  },
  
  stopSpeech: () => {
    speechService.cancel();
  },
  
  // Voice recognition
  isListening: false,
  
  startListening: () => {
    // Implementation would use the Web Speech API (SpeechRecognition)
    // This is a stub for now since it requires more complex setup
    set({ isListening: true });
    
    // In a real implementation, would start listening and process commands
    setTimeout(() => {
      set({ isListening: false });
      get().addNotification('info', 'Voice recognition not yet implemented', 3000);
    }, 2000);
  },
  
  stopListening: () => {
    // Stop speech recognition
    set({ isListening: false });
  }
}));
 