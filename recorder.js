
// Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// So we can story multiple recordings
const audioChunksArray = [];

// This sets up an audio stream from the user's system so we can then process/record it
navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
  const mediaRecorder = new MediaRecorder(stream);

  // links the start button in the html file to start recording
  document.getElementById("start").addEventListener("click", function(){
    var node = document.getElementById('ziqi');
    node.innerHTML = '<p>HELLO ZIQI!!!</p>';
    mediaRecorder.start();
  });

  // creates an array to store chunks of sequential audio data
  const audioChunks = [];

  // adds data to the array as it comes... but we don't really understand this
  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });

  // links the stop button in the html file to stop recording
  document.getElementById("stop").addEventListener("click", function(){
    var node = document.getElementById('ziqi');
    node.innerHTML = '<p>BYE ZIQI!!!</p>';
    mediaRecorder.stop();
  });

  // processes recorded data after recording is stopped
  mediaRecorder.addEventListener("stop", () => {
    // Original working for playback. Leaving just to show the method simpler than audioBuffer:
    // const audioBlob = new Blob(audioChunks);
    // const audioUrl = URL.createObjectURL(audioBlob);
    // const audio = new Audio(audioUrl);

    audioChunksArray.push(audioChunks);

    // converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer
    process(audioChunks);

    // checkboxManager();

  });
});


// function checkboxManager(){
//   audioChunksArray.length
//   for
// }



// converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer 
function process(data) {
  const blob = new Blob(data);
  
  convertToArrayBuffer(blob) // see function below
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // convert from arraybuffer to audiobuffer
      .then(play);
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
  document.getElementById("play").addEventListener("click", function(){sourceNode.start()});
  // sourceNode.start();
}


