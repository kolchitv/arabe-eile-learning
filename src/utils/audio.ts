/**
 * Audio & Speech Synthesis utilities for Faseeh Arabic App
 */

// Play text using browser Web Speech API with Arabic voice
export function speakArabic(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      resolve();
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Clean diacritics if needed or keep them (Arabic engines usually respect tashkeel)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'ar-SA';

    // Find best Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.lang.includes('ar-') || v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('tarik') || v.name.toLowerCase().includes('laila')
    );

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// Play pleasant synthesizer sound effects (Victory Chime, Tap, Error)
export function playSoundEffect(type: 'correct' | 'wrong' | 'levelup' | 'tap' | 'streak') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'levelup' || type === 'streak') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.24);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.36);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Ignore audio context errors silently
  }
}
