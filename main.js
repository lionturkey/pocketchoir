
// // Creating AudioContext to make audio buffers possible later on
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// // So we can story multiple recordings
// // const audioChunksArray = [];
// const audioBufferArray = [];
// globalSampleRate = 0;


import {makeRecordTab} from './modules/record.js'

makeRecordTab()

// // This sets up an audio stream from the user's system so we can then process/record it
// navigator.mediaDevices.getUserMedia({ audio: {
//     // the below audio options prevent the recording from cutting in and out while there is playback
//     autoGainControl: false,
//     echoCancellation: false
//     // noiseSuppression: false
// } })
// .then(async stream => {
//     const mediaRecorder = new MediaRecorder(stream);
    
//     // creates an array to store chunks of sequential audio data
//     const audioChunks = [];
//     sourceNode = null;
    

//     // links the play button in the html file to play selected clips
//     document.getElementById("play").addEventListener("click", function() {
//         // helper function to only play selected audio
//         // playSomething();
//         sourceNode = playSelected();

//         // toggle button
//         document.getElementById("play").style.display = "none";
//         document.getElementById("stop-playing").style.display = "inline";
//     });
//     document.getElementById("stop-playing").addEventListener("click", function() {
//         // helper function to only stop playing audio
//         stopPlaying(sourceNode);

//         // toggle button
//         document.getElementById("play").style.display = "inline";
//         document.getElementById("stop-playing").style.display = "none";
//     });
    
//     document.getElementById("merge").addEventListener("click", function() {
//         // helper function to only play selected audio
//         mergeSomething();
//     });
    
//     document.getElementById("delete").addEventListener("click", function() {
//         // helper function to only play selected audio
//         deleteSomething();
//     });
    
//     document.getElementById("download").addEventListener("click", function() {
//         // helper function to only play selected audio
//         downloadSomething();
//     });
    
    
//     // processes recorded data after recording is stopped
//     mediaRecorder.addEventListener("stop", () => {
//         // Original working for playback. Leaving just to show the method simpler than audioBuffer:
//         // const audioBlob = new Blob(audioChunks);
//         // const audioUrl = URL.createObjectURL(audioBlob);
//         // const audio = new Audio(audioUrl);
        
//         // Add the current recording to the overall recording list
//         addAudioBuffer([...audioChunks]);
//         // Note the shallow copy! [...array]
//         // audioChunksArray.push([...audioChunks]);
//         // process([...audioChunks])
//         //   .then(audioBufferArray.push)
//         console.log(audioBufferArray);
//         // // audioBufferArray.push(await process([...audioChunks]));
        
//     });
// });

// // update the checkboxes in the html document
// function checkboxManager() {
//     console.log('checkbox manager start\n');
    
//     var text = "";
//     for (i = 0; i < audioBufferArray.length; ++i){
//         text += "<input type=\"checkbox\" class=\"clip\" id=\"box" + i + "\" name=\"z\" value=\"" + i + "\"><br>";
//     }
//     var node = document.getElementById('recordlist');
//     node.innerHTML = text;
//     console.log('audioBufferArray.length:');
//     console.log(audioBufferArray.length);
// }

// // // helper function to only play selected audio
// // function playSomething() {
// //     play(buffMerger())
// // }




