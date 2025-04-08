import  * as Tone from 'tone';

// Mapping of genre to scale types
const GENRE_SCALES: Record<string, string[]> = {
  pop: ['major', 'major pentatonic'],
  rock: ['minor', 'minor pentatonic', 'blues'],
  hiphop: ['minor', 'minor pentatonic', 'dorian'],
  jazz: ['major', 'minor', 'dorian', 'mixolydian', 'lydian'],
  electronic: ['minor', 'phrygian', 'locrian'],
  classical: ['major', 'minor', 'harmonic minor', 'melodic minor'],
  rnb: ['minor', 'minor pentatonic', 'dorian'],
  country: ['major', 'major pentatonic', 'mixolydian'],
  ambient: ['major', 'minor', 'whole tone', 'lydian'],
  folk: ['major', 'dorian', 'mixolydian'],
  metal: ['minor', 'phrygian', 'locrian'],
  indie: ['major', 'minor', 'lydian', 'mixolydian']
};

// Mapping of mood to musical characteristics
const MOOD_CHARACTERISTICS: Record<string, {
  tempo: [number, number], // [min, max]
  dynamics: 'soft' | 'medium' | 'loud',
  articulation: 'staccato' | 'legato' | 'normal',
  harmonyComplexity: 'simple' | 'moderate' | 'complex'
}> = {
  energetic: { tempo: [120, 160], dynamics: 'loud', articulation: 'staccato', harmonyComplexity: 'moderate' },
  relaxed: { tempo: [60, 90], dynamics: 'soft', articulation: 'legato', harmonyComplexity: 'simple' },
  melancholic: { tempo: [65, 85], dynamics: 'soft', articulation: 'legato', harmonyComplexity: 'moderate' },
  uplifting: { tempo: [100, 130], dynamics: 'medium', articulation: 'normal', harmonyComplexity: 'simple' },
  dark: { tempo: [70, 100], dynamics: 'medium', articulation: 'normal', harmonyComplexity: 'complex' },
  dreamy: { tempo: [60, 80], dynamics: 'soft', articulation: 'legato', harmonyComplexity: 'moderate' },
  angry: { tempo: [140, 180], dynamics: 'loud', articulation: 'staccato', harmonyComplexity: 'complex' },
  peaceful: { tempo: [50, 75], dynamics: 'soft', articulation: 'legato', harmonyComplexity: 'simple' },
  nostalgic: { tempo: [65, 95], dynamics: 'medium', articulation: 'legato', harmonyComplexity: 'moderate' },
  dramatic: { tempo: [75, 110], dynamics: 'loud', articulation: 'normal', harmonyComplexity: 'complex' }
};

// Chord progressions by genre
const CHORD_PROGRESSIONS: Record<string, string[][]> = {
  pop: [['I', 'V', 'vi', 'IV'], ['I', 'IV', 'V'], ['vi', 'IV', 'I', 'V']],
  rock: [['I', 'IV', 'V'], ['i', 'VII', 'VI', 'V'], ['i', 'VI', 'III', 'VII']],
  hiphop: [['ii', 'V', 'I'], ['vi', 'IV', 'I', 'V'], ['i', 'VI', 'III', 'VII']],
  jazz: [['ii', 'V', 'I'], ['I', 'vi', 'ii', 'V'], ['iii', 'VI', 'ii', 'V']],
  electronic: [['i', 'VI', 'VII'], ['i', 'VII', 'VI', 'VII'], ['IV', 'I', 'V', 'vi']],
  classical: [['I', 'IV', 'V'], ['I', 'vi', 'IV', 'V'], ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V']],
  rnb: [['ii', 'V', 'I'], ['I', 'vi', 'IV', 'V'], ['i', 'iv', 'VII', 'III']],
  country: [['I', 'IV', 'V'], ['I', 'V', 'vi', 'IV'], ['vi', 'iii', 'IV', 'V']],
  ambient: [['I', 'vi'], ['I', 'iii', 'vi'], ['I', 'V', 'vi']],
  folk: [['I', 'V', 'I'], ['I', 'IV', 'I', 'V'], ['i', 'VII', 'VI', 'V']],
  metal: [['i', 'VII', 'VI'], ['i', 'V', 'VI', 'VII'], ['i', 'iv', 'VII', 'III']],
  indie: [['I', 'V', 'vi', 'IV'], ['vi', 'IV', 'I', 'V'], ['I', 'iii', 'vi', 'IV']]
};

interface InstrumentMix {
  [key: string]: number; // Instrument name to volume (0-100)
}

interface GenerationOptions {
  genre: string;
  tempo: number;
  mood: string;
  duration: number;
  instrumentFocus: 'balanced' | 'vocals' | 'instrumental';
  pitch: number;
  complexity: number;
  instrumentMix: InstrumentMix;
  onProgress?: (progress: number) => void;
}

class AudioGenerator {
  private static instance: AudioGenerator;
  private isPlaying = false;
  private currentSynths: Tone.PolySynth[] = [];
  private currentPart: Tone.Part | null = null;
  
  private constructor() {
    // Initialize
  }

  public static getInstance(): AudioGenerator {
    if (!AudioGenerator.instance) {
      AudioGenerator.instance = new AudioGenerator();
    }
    return AudioGenerator.instance;
  }

  public async generateMusic(options: GenerationOptions): Promise<{ buffer: AudioBuffer; waveform: number[] }> {
    await Tone.start();
    
    // Calculate the actual tempo based on mood and genre
    const moodData = MOOD_CHARACTERISTICS[options.mood] || MOOD_CHARACTERISTICS.energetic;
    const tempoRange = moodData.tempo;
    const tempo = options.tempo || Math.floor(tempoRange[0] + Math.random() * (tempoRange[1] - tempoRange[0]));
    
    // Set the Tone.js BPM
    Tone.Transport.bpm.value = tempo;
    
    // Select a random chord progression for the genre
    const genreProgressions = CHORD_PROGRESSIONS[options.genre] || CHORD_PROGRESSIONS.pop;
    const progression = genreProgressions[Math.floor(Math.random() * genreProgressions.length)];
    
    // Generate a melody based on the chord progression
    const notes = this.generateNotes(progression, options.complexity, options.duration);
    
    // Create synthesis based on instrument mix
    const mainSynth = this.createMainSynth(options.genre, options.mood, options.instrumentMix);
    this.currentSynths.push(mainSynth);
    
    // Create accompaniment if needed
    if (options.instrumentFocus !== 'vocals') {
      const accompSynth = this.createAccompanimentSynth(options.genre, options.mood, options.instrumentMix);
      this.currentSynths.push(accompSynth);
      
      // Create a bass line
      const bassSynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.8,
          release: 0.5
        }
      }).toDestination();
      bassSynth.volume.value = -15 + ((options.instrumentMix.bass || 50) - 50) * 0.3;
      this.currentSynths.push(bassSynth);
    }
    
    // Create a drum pattern if appropriate for the genre
    if (['pop', 'rock', 'hiphop', 'electronic', 'metal', 'rnb'].includes(options.genre)) {
      this.addDrumPattern(options.genre, options.mood, tempo, options.instrumentMix.drums || 70);
    }
    
    // Estimate total generation time (half real-time for synthesis)
    const totalGenerationTime = options.duration * 500; // Half of actual playback time
    let startTime = Date.now();
    
    // Start progress reporting
    if (options.onProgress) {
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(98, Math.floor((elapsedTime / totalGenerationTime) * 100));
        options.onProgress?.(progress);
        
        if (progress >= 98) {
          clearInterval(progressInterval);
        }
      }, 200);
    }
    
    // Render the audio to a buffer
    const buffer = await Tone.Offline(() => {
      // Schedule notes on the timeline
      const part = new Tone.Part((time, note) => {
        mainSynth.triggerAttackRelease(note.pitch, note.duration, time, note.velocity);
        
        // Play accompaniment if available
        if (this.currentSynths.length > 1 && note.chord) {
          this.currentSynths[1].triggerAttackRelease(note.chord, note.duration, time, note.velocity * 0.7);
        }
        
        // Play bass notes if available
        if (this.currentSynths.length > 2 && note.bass) {
          this.currentSynths[2].triggerAttackRelease(note.bass, note.duration * 1.5, time, note.velocity * 0.9);
        }
      }, notes);
      
      part.start(0);
      this.currentPart = part;
      
      // Start transport
      Tone.Transport.start();
    }, options.duration);
    
    // Generate waveform data for visualization
    const waveform = this.generateWaveformData(buffer);
    
    // Complete progress
    options.onProgress?.(100);
    
    return { buffer, waveform };
  }
  
  public stopGeneration(): void {
    if (this.currentPart) {
      this.currentPart.dispose();
      this.currentPart = null;
    }
    
    this.currentSynths.forEach(synth => synth.dispose());
    this.currentSynths = [];
    
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
  
  private generateNotes(chordProgression: string[], complexity: number, duration: number) {
    // Convert duration to number of bars (assuming 4/4 time signature)
    const numBars = Math.max(4, Math.ceil(duration / 15)); // At least 4 bars
    const notes = [];
    
    // Set complexity factors (1-100 scale)
    const rhythmicVariety = (complexity / 100) * 0.8 + 0.2; // 0.2-1.0
    const noteVariety = (complexity / 100) * 0.8 + 0.2;  // 0.2-1.0
    
    // Define basic scale degrees based on a major key
    const majorScaleNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    const minorScaleNotes = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'];
    
    // Map each chord to a set of harmonically aligned notes
    const chordToNotes: Record<string, string[]> = {
      'I': ['C4', 'E4', 'G4'],
      'ii': ['D4', 'F4', 'A4'],
      'iii': ['E4', 'G4', 'B4'],
      'IV': ['F4', 'A4', 'C5'],
      'V': ['G4', 'B4', 'D5'],
      'vi': ['A4', 'C5', 'E5'],
      'vii°': ['B4', 'D5', 'F5'],
      'i': ['C4', 'Eb4', 'G4'],
      'III': ['Eb4', 'G4', 'Bb4'],
      'iv': ['F4', 'Ab4', 'C5'],
      'v': ['G4', 'Bb4', 'D5'],
      'VI': ['Ab4', 'C5', 'Eb5'],
      'VII': ['Bb4', 'D5', 'F5']
    };
    
    // Define bass notes for each chord
    const chordToBass: Record<string, string> = {
      'I': 'C2',
      'ii': 'D2',
      'iii': 'E2',
      'IV': 'F2',
      'V': 'G2',
      'vi': 'A2',
      'vii°': 'B2',
      'i': 'C2',
      'III': 'Eb2',
      'iv': 'F2',
      'v': 'G2',
      'VI': 'Ab2',
      'VII': 'Bb2'
    };
    
    // Calculate total number of beats
    const beatsPerBar = 4; // Assuming 4/4 time signature
    const totalBeats = numBars * beatsPerBar;
    
    // Determine chord rhythm (how many beats per chord)
    let chordsPerBar;
    if (complexity < 30) {
      chordsPerBar = 1; // 1 chord per bar (whole note)
    } else if (complexity < 60) {
      chordsPerBar = 2; // 2 chords per bar (half notes)
    } else {
      chordsPerBar = 4; // 4 chords per bar (quarter notes)
    }
    
    // Fill in with a repeating chord progression as needed
    const expandedProgression = [];
    for (let i = 0; i < Math.ceil(numBars * chordsPerBar / chordProgression.length); i++) {
      expandedProgression.push(...chordProgression);
    }
    
    // Generate the notes from the expanded progression
    for (let beat = 0; beat < totalBeats; beat++) {
      const chordIndex = Math.floor(beat / (beatsPerBar / chordsPerBar)) % expandedProgression.length;
      const chord = expandedProgression[chordIndex];
      const chordNotes = chordToNotes[chord] || chordToNotes['I'];
      const bassNote = chordToBass[chord] || chordToBass['I'];
      
      // Decide if we want to play a note on this beat (rhythmic variety)
      if (Math.random() < rhythmicVariety) {
        // Choose a note from the chord
        const noteIndex = Math.floor(Math.random() * chordNotes.length);
        const notePitch = chordNotes[noteIndex];
        
        // Determine note duration (varies with complexity)
        let noteDuration;
        const durationRandom = Math.random();
        if (durationRandom < 0.4 - (0.2 * rhythmicVariety)) {
          // Quarter note
          noteDuration = "4n";
        } else if (durationRandom < 0.7 - (0.1 * rhythmicVariety)) {
          // Eighth note
          noteDuration = "8n";
        } else if (durationRandom < 0.85) {
          // Half note
          noteDuration = "2n";
        } else {
          // Sixteenth note
          noteDuration = "16n";
        }
        
        // Add variety in velocity
        const velocity = 0.5 + Math.random() * 0.5;
        
        // Add the note
        notes.push({
          time: `${beat}*0.25`,
          pitch: notePitch,
          duration: noteDuration,
          velocity: velocity,
          chord: chordNotes,
          bass: bassNote
        });
        
        // Possibly add a second note for more complex passages
        if (complexity > 50 && Math.random() < noteVariety * 0.4) {
          const secondNoteIndex = (noteIndex + 2) % chordNotes.length;
          notes.push({
            time: `${beat}*0.25+0.125`,
            pitch: chordNotes[secondNoteIndex],
            duration: "16n",
            velocity: velocity * 0.8,
            chord: chordNotes,
            bass: bassNote
          });
        }
      }
    }
    
    return notes;
  }
  
  private createMainSynth(genre: string, mood: string, instrumentMix: InstrumentMix): Tone.PolySynth {
    // Create a synth sound appropriate for the genre
    let synthOptions: Partial<Tone.SynthOptions> = {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 1
      }
    };
    
    // Modify the synth based on genre
    switch (genre) {
      case 'electronic':
        synthOptions.oscillator = { type: 'sawtooth' };
        synthOptions.envelope.attack = 0.01;
        synthOptions.envelope.release = 0.5;
        break;
      case 'ambient':
        synthOptions.oscillator = { type: 'sine' };
        synthOptions.envelope.attack = 0.4;
        synthOptions.envelope.release = 3;
        break;
      case 'rock':
      case 'metal':
        synthOptions.oscillator = { type: 'square' };
        synthOptions.envelope.attack = 0.05;
        synthOptions.envelope.sustain = 0.3;
        break;
      case 'jazz':
        synthOptions.oscillator = { type: 'triangle' };
        synthOptions.envelope.attack = 0.08;
        synthOptions.envelope.release = 0.8;
        break;
      case 'classical':
        synthOptions.oscillator = { type: 'sine' };
        synthOptions.envelope.attack = 0.1;
        synthOptions.envelope.release = 1.5;
        break;
    }
    
    // Modify the synth based on mood
    switch (mood) {
      case 'energetic':
      case 'angry':
        synthOptions.envelope.attack = Math.max(0.01, synthOptions.envelope.attack / 2);
        synthOptions.envelope.release = Math.max(0.1, synthOptions.envelope.release / 2);
        break;
      case 'relaxed':
      case 'peaceful':
      case 'dreamy':
        synthOptions.envelope.attack = Math.min(0.5, synthOptions.envelope.attack * 2);
        synthOptions.envelope.release = Math.min(3, synthOptions.envelope.release * 2);
        break;
    }
    
    // Create the synth
    const synth = new Tone.PolySynth(Tone.Synth, synthOptions).toDestination();
    
    // Apply effects based on genre and mood
    if (['electronic', 'ambient', 'dreamy'].includes(genre) || ['dreamy', 'melancholic'].includes(mood)) {
      const reverb = new Tone.Reverb(3).toDestination();
      synth.connect(reverb);
    }
    
    if (['rock', 'metal', 'hiphop'].includes(genre) || ['energetic', 'angry'].includes(mood)) {
      const distortion = new Tone.Distortion(0.2).toDestination();
      synth.connect(distortion);
    }
    
    if (['electronic', 'pop', 'rnb'].includes(genre)) {
      const delay = new Tone.FeedbackDelay(0.25, 0.3).toDestination();
      synth.connect(delay);
    }
    
    // Set volume based on instrument mix
    const leadVolume = instrumentMix.synth || instrumentMix.lead || 70;
    synth.volume.value = -12 + (leadVolume - 50) * 0.25; // Scale to a reasonable dB range
    
    return synth;
  }
  
  private createAccompanimentSynth(genre: string, mood: string, instrumentMix: InstrumentMix): Tone.PolySynth {
    // Create a different synth for accompaniment
    let synthOptions: Partial<Tone.SynthOptions> = {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2
      }
    };
    
    // Customize based on genre
    if (['classical', 'jazz'].includes(genre)) {
      // Piano-like
      synthOptions.oscillator = { type: 'triangle' };
    } else if (['rock', 'metal', 'electronic'].includes(genre)) {
      // Pad-like
      synthOptions.oscillator = { type: 'sawtooth' };
      synthOptions.envelope.attack = 0.3;
      synthOptions.envelope.release = 2;
    }
    
    const accompSynth = new Tone.PolySynth(Tone.Synth, synthOptions).toDestination();
    
    // Add effects for accompaniment
    const reverb = new Tone.Reverb(2).toDestination();
    accompSynth.connect(reverb);
    
    // Set volume based on instrument mix
    const padVolume = instrumentMix.pad || instrumentMix.strings || instrumentMix.piano || 60;
    accompSynth.volume.value = -15 + (padVolume - 50) * 0.3; // Slightly quieter than lead
    
    return accompSynth;
  }
  
  private addDrumPattern(genre: string, mood: string, tempo: number, volumeLevel: number) {
    // In a real implementation, this would add drum sounds
    // For now, we'll just log that drums would be added
    console.log(`Adding drum pattern for ${genre} in ${mood} mood at ${tempo} BPM`);
    
    // In a full implementation, we would:
    // 1. Create a drum sampler with appropriate samples
    // 2. Schedule drum patterns based on genre and mood
    // 3. Adjust volume based on volumeLevel
  }
  
  private generateWaveformData(buffer: AudioBuffer): number[] {
    // Generate a simplified waveform visualization from the audio buffer
    const channelData = buffer.getChannelData(0); // Use the first channel
    const samples = 100; // Number of points in the waveform
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];
    
    for (let i = 0; i < samples; i++) {
      const blockStart = i * blockSize;
      let max = 0;
      
      // Find the maximum absolute value in this block
      for (let j = 0; j < blockSize; j++) {
        const value = Math.abs(channelData[blockStart + j]);
        if (value > max) max = value;
      }
      
      // Scale the value to 0-100 range
      waveform.push(max * 100);
    }
    
    return waveform;
  }
}

export default AudioGenerator.getInstance();
 