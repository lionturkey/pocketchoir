
// update the checkboxes in the html document
function checkboxManager(ctx) {
    console.log('checkbox manager start\n');
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];

    var text = "";
    for (var i = 0; i < audioBufferArray.length; ++i){
        text += "<input type=\"checkbox\" class=\"clip\" id=\"box" + i + "\" name=\"z\" value=\"" + i + "\"><br>";
    }
    var node = document.getElementById('recordlist');
    node.innerHTML = text;
    // console.log('audioBufferArray.length:');
    // console.log(audioBufferArray.length);
}


function getSelectedBuffers(ctx) {
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];
    var selectedBuffers = [];
    for (var i = 0; i < audioBufferArray.length; ++i) {
        var idname = "box" + i;
        
        // only process (play) checked items
        if (document.getElementById(idname).checked){
            // console.log('selected i:')
            // console.log(i);
            selectedBuffers.push(audioBufferArray[i]);
        }
    }
    return selectedBuffers;
}


// helper function to merge selected audio
export function mergeSomething(ctx) {
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];
    var selectedBuffers = getSelectedBuffers(ctx);

    if (selectedBuffers.length > 0) {
        // Add the merged recording to the overall recording list
        audioBufferArray.push(mergeAudio(ctx, selectedBuffers));
        
        // update the checkboxes in the html document
        checkboxManager(ctx);
    }
    else {
        console.log("u idiot");
    }

}


export function deleteSomething(ctx) {
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];

    // prevent the buffer array length from changing while deleting
    var prevlength = audioBufferArray.length;
    var count = 0;
    for (var i = 0; i < prevlength; ++i){
        var idname = "box" + i;
        // only process (play) checked items
        // the count is an offest when you delete multiple at once
        if (document.getElementById(idname).checked){
            audioBufferArray.splice(i - count, 1);
            count++;
        }
    }
    checkboxManager(ctx);
}


export function downloadSomething(ctx) {
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];

    for (var i = 0; i < audioBufferArray.length; ++i){
        var idname = "box" + i;
        // only process (play) checked items
        // the count is an offest when you delete multiple at once
        if (document.getElementById(idname).checked){
            myDownload(ctx, audioBufferArray[i]);
        }
    }
}


function myDownload(ctx, buffer, filename) {
    const type = "audio/wav";
    const recorded = interleave(buffer);
    const dataview = writeHeaders(ctx, recorded);
    const audioBlob = new Blob([dataview], { type: type });
    const name = filename || "PocketChoir";
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = renderURL(audioBlob);
    a.download = `${name}.${audioBlob.type.split("/")[1]}`;
    a.click();
    return a;
}


// converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer 
// and pushes into audioBufferArray
export function addAudioBuffer(ctx, data) {
    // Grab needed parts of the context
    var audioBufferArray = ctx["audioBufferArray"];
    var audioContext = ctx["audioCtx"]
    const blob = new Blob(data);
    
    // console.log(blob)
    // console.log(ctx['sameCTX'])
    //  return audioContext.decodeAudioData(convertToArrayBuffer(blob));
    
    convertToArrayBuffer(blob) // see function below
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // convert from arraybuffer to audiobuffer
    .then(audioBuffer => {
        ctx["globalSampleRate"] = audioBuffer.sampleRate;
        audioBufferArray.push(audioBuffer)}) // push audioBuffer into the arr
    .then(() => checkboxManager(ctx)); // update the checkboxes in the html document
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


export function playGarbaj(ctx) {
    var selectedBuffers = getSelectedBuffers(ctx);

    if (selectedBuffers.length > 0) {
        play(ctx, mergeAudio(ctx, selectedBuffers));
        return;
    }
    else {
        console.log("tried to play with nothing selected");
    }
}


// we don't know what this buffer source is, but it works
function play(ctx, audioBuffer) {
    // Grab needed parts of the context
    var audioContext = ctx["audioCtx"]
    const sourceNode = audioContext.createBufferSource();
    
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    sourceNode.start();

    // this will mean the sourceNode is available
    // wherever there is ctx (good for stopPlaying)
    ctx['sourceNode'] = sourceNode;
}


export function stopPlaying(ctx) {
    console.log('in stopplaying');
    // Grab needed parts of the context
    var sourceNode = ctx['sourceNode']
    var audioContext = ctx["audioCtx"]
    if (sourceNode != null) {
        sourceNode.disconnect(audioContext.destination);
    }
}


function mergeAudio(ctx, buffers) {
    // Grab needed parts of the context
    var audioContext = ctx["audioCtx"];

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


// true, no-context utilities vvvvvvvv

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

// oops, turned out that this one needed ctx...
function writeHeaders(ctx, buffer) {
    // Grab needed parts of the context
    var globalSampleRate = ctx["globalSampleRate"];
    let arrayBuffer = new ArrayBuffer(44 + buffer.length * 2),
      view = new DataView(arrayBuffer);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + buffer.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, globalSampleRate, true);
    view.setUint32(28, globalSampleRate * 4, true);
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
    // let output;
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