import Tone from "tone"
import _ from "lodash"

import { solidKick } from "../instruments/kicks"
import { solidHat } from "../instruments/hats";
import { solidSynth } from "../instruments/synths";

// Pattern Maps
const arpSynthStartPattern = _.flatten([0, -2, -5, -4, 0, -2, -5].map(changedNote => [changedNote, 3, 5, 7]))

// Patterns
const arpSynth = new Tone.Pattern(function(time, note){
    solidSynth.triggerAttackRelease(note, "8n", time)
},
        [
                ...Tone.Frequency("A4").harmonize(arpSynthStartPattern),
                ...Tone.Frequency("A4").harmonize([8, 7, 5, 3])
        ],
        Tone.CtrlPattern.Type.Up
)
arpSynth.interval = "8n";


const steadyKick = new Tone.Pattern(function(time, note){
    solidKick.triggerAttackRelease(note, "8n", time)
}, Tone.Frequency("C-1").harmonize([0]));

const steadyHat = new Tone.Pattern(function(time, vel){
    solidHat.triggerAttackRelease("64n", time, vel)
}, [0.02, 0.02, 0.01, 0.02]);
steadyHat.interval = "16n";



const SECTIONS = {
    introKick: {
        length: "1:0:0",
        instrumentation: [
            steadyKick,
        ],
    },
    introKick2: {
        length: "1:0:0",
        instrumentation: [
            steadyKick,
        ],
    },
    introKickHat: {
        length: "1:0:0",
        instrumentation: [
            steadyKick,
            steadyHat
        ]
    },
    introKickHatSynth: {
        length: "4:0:0",
        instrumentation: [
            arpSynth,
            steadyKick,
            steadyHat
        ]
    }
}


const sectionChain = new Tone.CtrlMarkov({
    introKick: "introKick2",
    introKick2: "introKickHat",
    introKickHat: "introKickHatSynth",
    introKickHatSynth: "introKick"
})

const conductor = {
    start: function() {
        playInstrumentsInSection(sectionChain.value);
        Tone.Transport.schedule(() => (this.next()),  SECTIONS[sectionChain.value].length)
    },
    next: function() {
        stopInstrumentsInSection(sectionChain.value, sectionChain.next())
        playInstrumentsInSection(sectionChain.value)
        Tone.Transport.schedule(() => (this.next()),  "+" + SECTIONS[sectionChain.value].length)
    }
}

const playInstrumentsInSection = (section, startTime) => {
    console.log("play ", section, " scheduled");
    Tone.Transport.schedule(() => {
        console.log("playing: ", section)
        SECTIONS[section].instrumentation.forEach(pattern => {
            if (pattern.state !== "started") {
                pattern.loop = true;
                pattern.start();
            }
        })
    }, startTime)
}

const stopInstrumentsInSection = (currentSection, nextSection) => {
    console.log("stopping: ", currentSection)

    // if the instrumentation is different, stop the instrument playing
    const diffInsturments = _.xorWith(SECTIONS[currentSection].instrumentation, SECTIONS[nextSection].instrumentation, _.isEqual);


    diffInsturments.forEach(pattern => {
        console.log("p state in stop", pattern.state)
        pattern.stop()
    })
}


export default class FlyingHigh {
    init() {
        Tone.Transport.bpm.value = 160;
        Tone.Transport.swing = 0.05;

        solidKick.toMaster();
        solidSynth.toMaster();
        solidHat.toMaster();

        // playSection(sectionA)
        conductor.start();
    }

    play() {
        Tone.Transport.toggle()
    }

    stop() {
        Tone.Transport.toggle()
    }
}
