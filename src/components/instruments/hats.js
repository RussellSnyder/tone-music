import Tone from "tone"

const solidHat = new Tone.MetalSynth ({
    frequency: 190,
    envelope: {
        attack: 0.001,
        decay: 1,
        release: 0.2
    },
    harmonicity: 4.1,
    modulationIndex: 50,
    resonance: 2000,
    octaves: 0.5
})

export { solidHat }
