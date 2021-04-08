
import { playGarbaj, addAudioBuffer } from './utilities.js';
import { makeEditTab } from './edit.js';


export function makeRecordTab(ctx) {
    hideEditTab();

    // Grab needed parts of the context
    const lagInterval = ctx['lagInt'];

    // Grab the available buttons
    var recordButt = document.getElementById("record");
    var editTab = document.getElementById("edittab");

    // record button should play and record simultaneously
    recordButt.onclick = function(){
        console.log("Start recording");
        playGarbaj(ctx);

        // switch to image for StopRecord button
        recordButt.src = "images/stop_u12.svg";

        // Create and start the mediarecorder
        // TODO: add timer
        setTimeout(function(){recorder(ctx);}, lagInterval);
    };

    // button to switch to edit tab
    editTab.onclick = function(){
        makeEditTab(ctx);
    }

}


function hideEditTab(){
    // hide all buttons except for record
    document.getElementById("record").style.display = "inline";
    document.getElementById("play").style.display = "none";
    document.getElementById("delete").style.display = "none";
    document.getElementById("download").style.display = "none";
    document.getElementById("merge").style.display = "none";
}


function recorder(ctx) {
    // start mediarecorder
    navigator.mediaDevices.getUserMedia({ audio: {
        // the below audio options prevent the recording from cutting in and out while there is playback
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false
    } })
    .then(async stream => {
        // Create objects to record audio
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorder.start();

        // Event listener to add audio to array as it comes in
        mediaRecorder.ondataavailable = function(event){
            audioChunks.push(event.data);
        };

        var recordButt = document.getElementById("record");
        // recordButt is currently a StopRecord button, so
        // make it act accordingly
        recordButt.onclick = function(){
            console.log("stop recording");
            // switch to image for record button
            recordButt.src = "images/mic_background_u1.svg";
            mediaRecorder.stop();

            // without a short delay, addAudioBuffer can't
            // handle audioChunks for some reason. This is likely
            // device specific, but I've set it to .1s for now.
            setTimeout(function(){
                addAudioBuffer(ctx, audioChunks);
                // reset tab
                makeRecordTab(ctx);    
            }, 100);

        }
    })

}