


import { playGarbaj } from 'utilities.js';

// var isRecording = false;
const lagInterval = 100;


export function makeRecordTab() {


    var recordButt = document.getElementById("record")
    recordButt.onclick = function(){
        playGarbaj();
        setTimeout(function(){recorder();}, lagInterval);
        console.log("Start recording")
    }
    

}


function recorder() {

    navigator.mediaDevices.getUserMedia({ audio: {
        // the below audio options prevent the recording from cutting in and out while there is playback
        autoGainControl: false,
        echoCancellation: false
        // noiseSuppression: false
    } })
    .then(async stream => {
        const mediaRecorder = new MediaRecorder(stream);
        
        // creates an array to store chunks of sequential audio data
        var audioChunks = [];
        sourceNode = null;
        
        mediaRecorder.start();

        // adds data to the array as it comes... but we don't really understand this
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        var recordButt = document.getElementById("record")
        recordButt.onclick = function(){
            console.log("stop recording")
            mediaRecorder.stop();
            return audioChunks;
        }
    }

}