export  type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
};

export type Genre = 
  | 'pop' 
  | 'rock' 
  | 'hiphop' 
  | 'jazz' 
  | 'electronic' 
  | 'classical' 
  | 'rnb' 
  | 'country'
  | 'ambient'
  | 'folk'
  | 'metal'
  | 'indie';

export type Mood =
  | 'energetic'
  | 'relaxed'
  | 'melancholic'
  | 'uplifting'
  | 'dark'
  | 'dreamy'
  | 'angry'
  | 'peaceful'
  | 'nostalgic'
  | 'dramatic';

export type InstrumentFocus = 'balanced' | 'vocals' | 'instrumental';

export type MusicGenParams = {
  genre: Genre;
  tempo: number;
  mood: Mood;
  lyrics: boolean;
  duration: number;
  instrumentFocus: InstrumentFocus;
  pitch: number;
  complexity: number;
  instrumentMix: Record<string, number>;
  theme?: string;
  keywords?: string[];
};

export type GeneratedTrack = {
  id: string;
  title: string;
  genre: Genre;
  duration: number;
  createdAt: Date;
  audioUrl?: string;
  audioBuffer?: AudioBuffer;
  waveform?: number[];
  lyrics?: string;
  coverArt?: string;
  params: Partial<MusicGenParams>;
};

export type LyricsTheme = 'love' | 'nature' | 'journey' | 'future' | 'hope' | 'urban' | 'freedom' | 'loss' | 'power' | 'change';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export type MistralResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type VoiceRecognitionStatus = 'inactive' | 'listening' | 'processing' | 'error';
 