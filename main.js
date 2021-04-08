
// // Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

import {makeRecordTab} from './modules/record.js'

var lagInterval = 100;
var project = "upload-clip";
var globalSampleRate = 0;

const ctx = {
    audioBufferArray: [],
    selectedBuffers: [],
    audioCtx: audioContext,
    globalSR: globalSampleRate,
    lagInt: lagInterval,
    sourceNode: null,
    projectid: project
};


console.log('please workk');
makeRecordTab(ctx);

// console.log(ctx['sameCTX']);