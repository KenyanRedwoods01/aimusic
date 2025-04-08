//  Speech synthesis service to generate speech from text
class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  private constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private async initVoices(): Promise<void> {
    // Load voices if already available
    this.voices = this.synth.getVoices();
    
    // If voices aren't immediately available, wait for them to load
    if (this.voices.length === 0) {
      await new Promise<void>((resolve) => {
        const voicesChanged = () => {
          this.voices = this.synth.getVoices();
          this.isInitialized = true;
          resolve();
          window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChanged);
      });
    } else {
      this.isInitialized = true;
    }
  }

  public async speakText(text: string, options: {
    rate?: number; // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    voiceIndex?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}): Promise<void> {
    // Ensure voices are initialized
    if (!this.isInitialized) {
      await this.initVoices();
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (options.voiceIndex !== undefined && options.voiceIndex < this.voices.length) {
      utterance.voice = this.voices[options.voiceIndex];
    } else {
      // Default to a good English voice if available
      const englishVoice = this.voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google') || voice.name.includes('Daniel')
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    
    // Set other properties
    if (options.rate !== undefined) utterance.rate = Math.max(0.1, Math.min(10, options.rate));
    if (options.pitch !== undefined) utterance.pitch = Math.max(0, Math.min(2, options.pitch));
    if (options.volume !== undefined) utterance.volume = Math.max(0, Math.min(1, options.volume));
    
    // Event callbacks
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    
    // Start speaking
    this.synth.speak(utterance);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public pause(): void {
    this.synth.pause();
  }

  public resume(): void {
    this.synth.resume();
  }

  public cancel(): void {
    this.synth.cancel();
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

export default SpeechService.getInstance();
 