// Lightweight sound effects using Web Audio API — no external dependencies

type SoundType =
  | "click"
  | "decision"
  | "event_good"
  | "event_bad"
  | "taku"
  | "birth"
  | "death"
  | "milestone"
  | "money"
  | "levelup";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Play a synthesized sound effect */
export function playSound(type: SoundType, volume = 0.3): void {
  if (typeof window === "undefined") return;

  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = volume;

    switch (type) {
      case "click": {
        // Short tick
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 800;
        osc.connect(gain);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case "decision": {
        // Two-tone confirm
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.value = 440;
        osc1.connect(gain);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc1.start(now);
        osc1.stop(now + 0.15);

        const gain2 = ctx.createGain();
        gain2.connect(ctx.destination);
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 660;
        osc2.connect(gain2);
        gain2.gain.setValueAtTime(volume, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.25);
        break;
      }

      case "event_good": {
        // Rising arpeggio
        [523, 659, 784].forEach((freq, i) => {
          const g = ctx.createGain();
          g.connect(ctx.destination);
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          osc.connect(g);
          const t = now + i * 0.1;
          g.gain.setValueAtTime(volume * 0.7, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
          osc.start(t);
          osc.stop(t + 0.2);
        });
        break;
      }

      case "event_bad": {
        // Descending minor
        [440, 370, 311].forEach((freq, i) => {
          const g = ctx.createGain();
          g.connect(ctx.destination);
          const osc = ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.value = freq;
          osc.connect(g);
          const t = now + i * 0.12;
          g.gain.setValueAtTime(volume * 0.6, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.start(t);
          osc.stop(t + 0.25);
        });
        break;
      }

      case "taku": {
        // Ominous low rumble with dissonance
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = 80;
        osc.frequency.linearRampToValueAtTime(60, now + 0.8);
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 300;
        osc.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(volume * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);

        // Dissonant overtone
        const g2 = ctx.createGain();
        g2.connect(ctx.destination);
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 123; // tritone
        osc2.connect(g2);
        g2.gain.setValueAtTime(volume * 0.3, now + 0.2);
        g2.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
        osc2.start(now + 0.2);
        osc2.stop(now + 0.9);
        break;
      }

      case "birth": {
        // Gentle chime
        [784, 988, 1175].forEach((freq, i) => {
          const g = ctx.createGain();
          g.connect(ctx.destination);
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          osc.connect(g);
          const t = now + i * 0.15;
          g.gain.setValueAtTime(volume * 0.5, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.5);
        });
        break;
      }

      case "death": {
        // Slow descending tone, fading
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 440;
        osc.frequency.exponentialRampToValueAtTime(110, now + 2);
        osc.connect(gain);
        gain.gain.setValueAtTime(volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        osc.start(now);
        osc.stop(now + 2);
        break;
      }

      case "milestone": {
        // Fanfare
        [523, 659, 784, 1047].forEach((freq, i) => {
          const g = ctx.createGain();
          g.connect(ctx.destination);
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.value = freq;
          osc.connect(g);
          const t = now + i * 0.08;
          g.gain.setValueAtTime(volume * 0.3, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
        });
        break;
      }

      case "money": {
        // Coin sound — high ping
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 1200;
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
        osc.connect(gain);
        gain.gain.setValueAtTime(volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case "levelup": {
        // Ascending sweep
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 400;
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        osc.connect(gain);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
    }
  } catch {
    // Audio context might not be available
  }
}
