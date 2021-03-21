
// Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// So we can story multiple recordings
const audioChunksArray = [];
const audioBufferArray = [];
//const sampleRate = 48000;

// This sets up an audio stream from the user's system so we can then process/record it
navigator.mediaDevices.getUserMedia({ audio: {
    // the below audio options prevent the recording from cutting in and out while there is playback
    autoGainControl: false,
    echoCancellation: false
    // noiseSuppression: false
} })
.then(async stream => {
    const mediaRecorder = new MediaRecorder(stream);
    
    // creates an array to store chunks of sequential audio data
    const audioChunks = [];
    
    // start with the stop recording button hidden
    document.getElementById("stop").style.display = "none";

    // links the start button in the html file to start recording
    document.getElementById("start").addEventListener("click", function() {
        // var node = document.getElementById('ziqi');
        // node.innerHTML = '<p>HELLO ZIQI!!!</p>';
        audioChunks.length = 0;
        
        //TODO ?????????????????????????????????????????????????????????????????????????????????????????
        // playSomething();
        // setTimeout(play(buffMerger()), 2000)
        play(buffMerger());
        // mediaRecorder.start();
        setTimeout(function(){mediaRecorder.start();}, 100);

        // toggle button
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "inline";
    });
    
    // adds data to the array as it comes... but we don't really understand this
    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });
    
    // links the stop button in the html file to stop recording
    document.getElementById("stop").addEventListener("click", function() {
        // var node = document.getElementById('ziqi');
        // node.innerHTML = '<p>BYE ZIQI!!!</p>';

        // toggle button
        document.getElementById("start").style.display = "inline";
        document.getElementById("stop").style.display = "none";

        mediaRecorder.stop();
    });
    
    // links the play button in the html file to play selected clips
    document.getElementById("play").addEventListener("click", function() {
        // helper function to only play selected audio
        // playSomething();
        play(buffMerger())
    });
    
    document.getElementById("merge").addEventListener("click", function() {
        // helper function to only play selected audio
        mergeSomething();
    });
    
    document.getElementById("delete").addEventListener("click", function() {
        // helper function to only play selected audio
        deleteSomething();
    });
    
    document.getElementById("download").addEventListener("click", function() {
        // helper function to only play selected audio
        downloadSomething();
    });
    
    
    // processes recorded data after recording is stopped
    mediaRecorder.addEventListener("stop", () => {
        // Original working for playback. Leaving just to show the method simpler than audioBuffer:
        // const audioBlob = new Blob(audioChunks);
        // const audioUrl = URL.createObjectURL(audioBlob);
        // const audio = new Audio(audioUrl);
        
        // Add the current recording to the overall recording list
        addAudioBuffer([...audioChunks]);
        // Note the shallow copy! [...array]
        // audioChunksArray.push([...audioChunks]);
        // process([...audioChunks])
        //   .then(audioBufferArray.push)
        console.log(audioBufferArray);
        // // audioBufferArray.push(await process([...audioChunks]));
        
    });
});

// update the checkboxes in the html document
function checkboxManager() {
    console.log('checkbox manager start\n');
    
    var text = "";
    for (i = 0; i < audioBufferArray.length; ++i){
        text += "<input type=\"checkbox\" class=\"clip\" id=\"box" + i + "\" name=\"z\" value=\"" + i + "\"><br>";
    }
    var node = document.getElementById('recordlist');
    node.innerHTML = text;
    console.log('audioBufferArray.length:');
    console.log(audioBufferArray.length);
}

// // helper function to only play selected audio
// function playSomething() {
//     play(buffMerger())
// }

// helper function to merge selected audio
function mergeSomething() {
    
    // Add the merged recording to the overall recording list
    audioBufferArray.push(buffMerger());
    
    // update the checkboxes in the html document
    checkboxManager();

}

// helper to the helpers of play and merge somethings
function buffMerger() {
    selectedBuffers = [];
    for (i = 0; i < audioBufferArray.length; ++i){
        var idname = "box" + i;
        
        // only process (play) checked items
        if (document.getElementById(idname).checked){
            console.log('i:')
            console.log(i);
            selectedBuffers.push(audioBufferArray[i]);
        }
    }
    if (selectedBuffers.length > 0) {
        // const mergedBuffer = mergeAudio(selectedBuffers);
        return mergeAudio(selectedBuffers);
    }
    else {
        console.log("u idiot");
    }
}

function deleteSomething() {
    // prevent the buffer array length from changing while deleting
    var prevlength = audioBufferArray.length;
    var count = 0;
    for (i = 0; i < prevlength; ++i){
        var idname = "box" + i;
        // only process (play) checked items
        // the count is an offest when you delete multiple at once
        if (document.getElementById(idname).checked){
            audioBufferArray.splice(i - count, 1);
            count++;
        }
    }
    checkboxManager();
}

function downloadSomething() {
    // prevent the buffer array length from changing while deleting
    for (i = 0; i < audioBufferArray.length; ++i){
        var idname = "box" + i;
        // only process (play) checked items
        // the count is an offest when you delete multiple at once
        if (document.getElementById(idname).checked){
            myDownload(audioBufferArray[i]);
        }
    }
}

function myDownload(buffer, filename) {
    const type = "audio/wav";
    const recorded = interleave(buffer);
    const dataview = writeHeaders(recorded);
    const audioBlob = new Blob([dataview], { type: type });
    const name = filename || "PochetChoir";
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = renderURL(audioBlob);
    a.download = `${name}.${audioBlob.type.split("/")[1]}`;
    a.click();
    return a;
}

// converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer 
// and pushes into audioBufferArray
function addAudioBuffer(data) {
    const blob = new Blob(data);
    
    console.log(blob)
    
    //  return audioContext.decodeAudioData(convertToArrayBuffer(blob));
    
    convertToArrayBuffer(blob) // see function below
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // convert from arraybuffer to audiobuffer
    .then(audioBuffer => audioBufferArray.push(audioBuffer)) // push audioBuffer into the arr
    .then(() => checkboxManager()); // update the checkboxes in the html document
    // .then(play);
}

// makes a url for the blob, then fetches directly from the url and converts to an arraybuffer
// (we know it's complicated, but it works [don't know why])
// Purpose: blob -> arraybuffer, so we can do further processing (buffers are good for easy merging and playback of audio)
function convertToArrayBuffer(blob) {
    const url = URL.createObjectURL(blob);
    
    return fetch(url).then(response => {
        return response.arrayBuffer();
    });
}

// we don't know what this buffer source is, but it works
function play(audioBuffer) {
    const sourceNode = audioContext.createBufferSource();
    
    sourceNode.buffer = audioBuffer;
    // sourceNode.detune.value = -300;
    
    sourceNode.connect(audioContext.destination);
    // document.getElementById("play").addEventListener("click", function(){sourceNode.start()});
    sourceNode.start();
}



function mergeAudio(buffers) {
    console.log(buffers);
    const output = audioContext.createBuffer(
                                             maxNumberOfChannels(buffers),
                                             buffers[0].sampleRate * maxDuration(buffers),
                                             buffers[0].sampleRate
                                             );
    
    buffers.forEach((buffer) => {
        for (
             let channelNumber = 0;
             channelNumber < buffer.numberOfChannels;
             channelNumber += 1
             ) {
            const outputData = output.getChannelData(channelNumber);
            const bufferData = buffer.getChannelData(channelNumber);
            
            for (
                 let i = buffer.getChannelData(channelNumber).length - 1;
                 i >= 0;
                 i -= 1
                 ) {
                outputData[i] += bufferData[i];
            }
            
            output.getChannelData(channelNumber).set(outputData);
        }
    });
    return output;
}

function maxDuration(buffers) {
    return Math.max.apply(
                          Math,
                          buffers.map((buffer) => buffer.duration)
                          );
}

function maxNumberOfChannels(buffers) {
    return Math.max.apply(
                          Math,
                          buffers.map((buffer) => buffer.numberOfChannels)
                          );
}

function interleave(input) {
    let buffer = input.getChannelData(0),
      length = buffer.length * 2,
      result = new Float32Array(length),
      index = 0,
      inputIndex = 0;

    while (index < length) {
      result[index++] = buffer[inputIndex];
      result[index++] = buffer[inputIndex];
      inputIndex++;
    }
    return result;
  }

function writeHeaders(buffer) {
    let arrayBuffer = new ArrayBuffer(44 + buffer.length * 2),
      view = new DataView(arrayBuffer);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + buffer.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, this._sampleRate, true);
    view.setUint32(28, this._sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, buffer.length * 2, true);

    return floatTo16BitPCM(view, buffer, 44);
  }

function renderURL(blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
  }

function writeString(dataview, offset, header) {
    let output;
    for (var i = 0; i < header.length; i++) {
      dataview.setUint8(offset + i, header.charCodeAt(i));
    }
  }

function floatTo16BitPCM(dataview, buffer, offset) {
    for (var i = 0; i < buffer.length; i++, offset += 2) {
      let tmp = Math.max(-1, Math.min(1, buffer[i]));
      dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7fff, true);
    }
    return dataview;
  }