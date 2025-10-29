// Audio system for the game
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.3;
        this.enabled = true;
        
        this.initAudioContext();
        this.createSounds();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Create procedural audio effects
    createSounds() {
        if (!this.enabled) return;

        this.sounds = {
            explosion: this.createExplosionSound(),
            powerup: this.createPowerUpSound(),
            damage: this.createDamageSound(),
            shield: this.createShieldSound(),
            levelUp: this.createLevelUpSound(),
            gameOver: this.createGameOverSound(),
            asteroid: this.createAsteroidHitSound()
        };
        
        // Initialize background music
        this.backgroundMusic = null;
        this.musicPlaying = false;
    }

    createExplosionSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 0.3;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Create explosion-like noise
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createPowerUpSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 0.4;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createDamageSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 0.2;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume * 0.7, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createShieldSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 0.5;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createLevelUpSound() {
        return () => {
            if (!this.enabled) return;
            
            const playNote = (freq, delay, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + delay);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + delay + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + duration);
                
                oscillator.start(this.audioContext.currentTime + delay);
                oscillator.stop(this.audioContext.currentTime + delay + duration);
            };
            
            // Play a chord progression
            playNote(261.63, 0, 0.3);    // C4
            playNote(329.63, 0.1, 0.3);  // E4
            playNote(392.00, 0.2, 0.4);  // G4
        };
    }

    createGameOverSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 1.0;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createAsteroidHitSound() {
        return () => {
            if (!this.enabled) return;
            
            const duration = 0.15;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(60, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    // Create ambient background music
    startBackgroundMusic(level = 1) {
        if (!this.enabled || this.musicPlaying) return;
        
        this.musicPlaying = true;
        this.currentLevel = level;
        this.playAmbientMusic();
    }

    stopBackgroundMusic() {
        this.musicPlaying = false;
        if (this.backgroundMusic) {
            this.backgroundMusic.forEach(source => {
                try {
                    source.stop();
                } catch (e) {
                    // Source might already be stopped
                }
            });
            this.backgroundMusic = null;
        }
    }

    updateMusicLevel(level) {
        this.currentLevel = level;
        // Music will update on next cycle
    }

    playAmbientMusic() {
        if (!this.enabled || !this.musicPlaying) return;

        // Create progressively intense music based on level
        this.backgroundMusic = [];
        
        const level = this.currentLevel || 1;
        const intensity = Math.min(level / 10, 1); // Cap intensity at level 10
        
        // Calculate tempo multiplier (gets faster each level)
        const tempoMultiplier = 1 + (level - 1) * 0.1; // 1x, 1.1x, 1.2x, etc.
        const baseDuration = 16 / tempoMultiplier;
        
        // Main bass line (gets more aggressive)
        this.createProgressiveBassLine(level, baseDuration);
        
        // Melody (gets more complex)
        this.createProgressiveMelody(level, baseDuration);
        
        // Percussion (gets more intense)
        this.createProgressivePercussion(level, baseDuration);
        
        // Additional layers for higher levels
        if (level >= 1) { // Start arpeggios from level 1!
            this.createArpeggio(level, baseDuration);
        }
        
        if (level >= 4) { // Moved lead synth to level 4
            this.createLeadSynth(level, baseDuration);
        }
        
        if (level >= 7) {
            this.createDistortionLayer(level, baseDuration);
        }
        
        // Schedule next music cycle (gets faster each level)
        setTimeout(() => {
            if (this.musicPlaying) {
                this.playAmbientMusic();
            }
        }, baseDuration * 1000);
    }

    createProgressiveBassLine(level, duration) {
        // Start with upbeat bass even at level 1
        const baseFreq = 65.41; // C2
        const bassNotes = [baseFreq, baseFreq * 1.335, baseFreq * 1.498, baseFreq]; // C2, E2, F#2, C2 - more melodic
        const noteDuration = duration / 4;
        
        // Start with sawtooth for immediate punch, gets more aggressive with level
        const waveTypes = ['sawtooth', 'sawtooth', 'square'];
        const waveType = waveTypes[Math.min(Math.floor(level / 4), 2)];
        
        bassNotes.forEach((frequency, index) => {
            const startTime = this.audioContext.currentTime + index * noteDuration;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            // Start with punchy filter even at level 1
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400 + level * 30, startTime); // Start higher
            filter.Q.setValueAtTime(4 + level * 0.5, startTime); // Start with some resonance
            
            // More prominent bass from level 1
            const volume = this.volume * (0.18 + level * 0.01); // Start louder
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05); // Faster attack
            gainNode.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + noteDuration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + noteDuration);
            
            this.backgroundMusic.push(oscillator);
        });
    }

    createProgressiveMelody(level, duration) {
        // Start with catchy, upbeat melody at level 1
        const catchyMelody = [
            {freq: 523.25, time: 0, duration: 0.4},    // C5 - Start high and bright
            {freq: 659.25, time: 0.4, duration: 0.4},  // E5
            {freq: 783.99, time: 0.8, duration: 0.4},  // G5
            {freq: 1046.50, time: 1.2, duration: 0.8}, // C6 - Hold the high note
            {freq: 783.99, time: 2.2, duration: 0.3},  // G5
            {freq: 659.25, time: 2.5, duration: 0.3},  // E5
            {freq: 523.25, time: 2.8, duration: 0.4},  // C5
            {freq: 587.33, time: 3.4, duration: 0.3},  // D5
            {freq: 659.25, time: 3.7, duration: 0.3}   // E5
        ];
        
        // Add more complex variations for higher levels
        const extraNotes = [
            {freq: 880.00, time: 4.2, duration: 0.3},  // A5
            {freq: 987.77, time: 4.5, duration: 0.3},  // B5
            {freq: 1174.66, time: 4.8, duration: 0.4}, // D6
            {freq: 1318.51, time: 5.4, duration: 0.6}  // E6
        ];
        
        let melody = [...catchyMelody];
        if (level >= 3) {
            melody = melody.concat(extraNotes.slice(0, Math.min(level - 2, 4)));
        }
        
        // Scale time to fit duration
        const timeScale = duration / 8;
        
        melody.forEach(note => {
            const startTime = this.audioContext.currentTime + note.time * timeScale;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Start with square wave for retro-catchy sound
            oscillator.type = level >= 5 ? 'sawtooth' : 'square';
            oscillator.frequency.setValueAtTime(note.freq * (1 + level * 0.01), startTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(note.freq * (3 + level * 0.2), startTime); // Start brighter
            
            // More prominent melody from the start
            const volume = this.volume * (0.10 + level * 0.005); // Start louder
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03); // Quick attack
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration * timeScale);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + note.duration * timeScale);
            
            this.backgroundMusic.push(oscillator);
        });
    }

    createProgressivePercussion(level, duration) {
        // Start with energetic percussion even at level 1
        const baseBeats = Math.max(8, 4 + level); // Start with 8 beats minimum
        const beatDuration = duration / baseBeats;
        
        // More beats for higher levels
        const totalBeats = Math.min(8 + level * 2, 32);
        const beatInterval = duration / totalBeats;
        
        for (let i = 0; i < totalBeats; i++) {
            const startTime = this.audioContext.currentTime + i * beatInterval;
            
            // More frequent kicks from level 1
            if (i % 4 === 0 || (level >= 2 && i % 2 === 0)) {
                this.createProgressiveKick(startTime, level);
            }
            
            // Hi-hat on every beat for immediate energy
            if (i % 1 === 0) {
                this.createProgressiveHiHat(startTime, level);
            }
            
            // Add snare earlier (level 2 instead of 4)
            if (level >= 2 && i % 8 === 4) {
                this.createSnare(startTime, level);
            }
            
            // Add extra percussion elements for higher energy
            if (level >= 1 && i % 6 === 2) {
                this.createShaker(startTime, level);
            }
        }
    }

    createProgressiveKick(startTime, level) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        const baseFreq = 65 - level * 1; // Start punchy, gets slightly lower
        oscillator.frequency.setValueAtTime(baseFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, startTime + 0.15);
        
        // More prominent kick from level 1
        const volume = this.volume * (0.20 + level * 0.008); // Start louder
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
        
        this.backgroundMusic.push(oscillator);
    }

    createProgressiveHiHat(startTime, level) {
        const bufferSize = 1024;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6000 + level * 300, startTime); // Start bright
        
        // More present hi-hats from level 1
        const volume = this.volume * (0.06 + level * 0.003); // Start louder
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08 + level * 0.01);
        
        source.start(startTime);
        source.stop(startTime + 0.12);
        
        this.backgroundMusic.push(source);
    }

    createShaker(startTime, level) {
        // Add shaker for extra rhythm from level 1
        const bufferSize = 512;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4000 + level * 200, startTime);
        filter.Q.setValueAtTime(3, startTime);
        
        const volume = this.volume * (0.03 + level * 0.002);
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
        
        source.start(startTime);
        source.stop(startTime + 0.06);
        
        this.backgroundMusic.push(source);
    }

    createSnare(startTime, level) {
        // Create snare drum sound
        const bufferSize = 2048;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000 + level * 100, startTime);
        filter.Q.setValueAtTime(5, startTime);
        
        const volume = this.volume * (0.08 + level * 0.005);
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        
        source.start(startTime);
        source.stop(startTime + 0.2);
        
        this.backgroundMusic.push(source);
    }

    createArpeggio(level, duration) {
        // Create fast arpeggiated synth pattern - gets more complex with level
        const baseNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        // Add more notes for higher levels
        const extraNotes = [1318.51, 1567.98, 2093.00]; // E6, G6, C7
        let arpNotes = [...baseNotes];
        
        if (level >= 5) {
            arpNotes = arpNotes.concat(extraNotes.slice(0, level - 4));
        }
        
        const noteInterval = (duration / 2) / (arpNotes.length * 4); // Play pattern 4 times
        const startOffset = duration / 2; // Start halfway through
        
        for (let cycle = 0; cycle < arpNotes.length * 4; cycle++) {
            const noteIndex = cycle % arpNotes.length;
            const startTime = this.audioContext.currentTime + startOffset + (cycle * noteInterval);
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(arpNotes[noteIndex], startTime);
            
            const volume = this.volume * (0.04 + level * 0.002);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteInterval);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + noteInterval);
            
            this.backgroundMusic.push(oscillator);
        }
    }

    createLeadSynth(level, duration) {
        // High-energy lead synth for levels 5+
        const leadMelody = [
            1046.50, 1174.66, 1318.51, 1567.98, 1318.51, 1174.66, 1046.50, 1174.66
        ];
        
        const noteDuration = duration / leadMelody.length;
        
        leadMelody.forEach((frequency, index) => {
            const startTime = this.audioContext.currentTime + index * noteDuration;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            // Aggressive filter sweep
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(frequency, startTime);
            filter.frequency.linearRampToValueAtTime(frequency * 3, startTime + noteDuration);
            filter.Q.setValueAtTime(8 + level, startTime);
            
            const volume = this.volume * (0.06 + level * 0.003);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + noteDuration);
            
            this.backgroundMusic.push(oscillator);
        });
    }

    createDistortionLayer(level, duration) {
        // Extreme distorted layer for levels 7+
        const distortionNotes = [65.41, 73.42, 82.41, 87.31]; // Low bass notes
        const noteDuration = duration / 4;
        
        distortionNotes.forEach((frequency, index) => {
            const startTime = this.audioContext.currentTime + index * noteDuration;
            
            // Create multiple detuned oscillators for fat sound
            for (let i = 0; i < 3; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const waveshaper = this.audioContext.createWaveShaper();
                
                // Create distortion curve
                const samples = 44100;
                const curve = new Float32Array(samples);
                const deg = Math.PI / 180;
                
                for (let j = 0; j < samples; j++) {
                    const x = (j * 2) / samples - 1;
                    curve[j] = ((3 + level) * 20 * deg) * x * 57 * (deg) / (Math.PI + level * Math.abs(x));
                }
                
                waveshaper.curve = curve;
                waveshaper.oversample = '4x';
                
                oscillator.connect(waveshaper);
                waveshaper.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sawtooth';
                const detune = (i - 1) * 5; // Slight detuning
                oscillator.frequency.setValueAtTime(frequency + detune, startTime);
                
                const volume = this.volume * (0.03 + level * 0.001);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + noteDuration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + noteDuration);
                
                this.backgroundMusic.push(oscillator);
            }
        });
    }

    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            // Resume audio context if it's suspended (required by browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            this.sounds[soundName]();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            // Resume music if it was playing
            if (this.musicPlaying) {
                this.startBackgroundMusic();
            }
        } else {
            // Stop music when disabled
            this.stopBackgroundMusic();
        }
        return this.enabled;
    }
}