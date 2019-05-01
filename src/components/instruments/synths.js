import Tone from "tone"

const solidSynth = new Tone.Synth({
    oscillator  : {
        type  : "triangle"
    },
    envelope  : {
        attack  : 0.02,
        decay  : 0.1,
        sustain  : 0.3,
        release  : 0.1
    }
});

export { solidSynth }
