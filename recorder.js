
// Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// So we can story multiple recordings
const audioChunksArray = [];

// This sets up an audio stream from the user's system so we can then process/record it
navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
  const mediaRecorder = new MediaRecorder(stream);

  // creates an array to store chunks of sequential audio data
  const audioChunks = [];

  // links the start button in the html file to start recording
  document.getElementById("start").addEventListener("click", function(){
    // var node = document.getElementById('ziqi');
    // node.innerHTML = '<p>HELLO ZIQI!!!</p>';
    audioChunks.length = 0;
    mediaRecorder.start();
  });

  // adds data to the array as it comes... but we don't really understand this
  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });

  // links the stop button in the html file to stop recording
  document.getElementById("stop").addEventListener("click", function(){
    // var node = document.getElementById('ziqi');
    // node.innerHTML = '<p>BYE ZIQI!!!</p>';
    mediaRecorder.stop();
  });

  // links the play button in the html file to play selected clips
  document.getElementById("play").addEventListener("click", function(){
    // helper function to only play selected audio
    playSomething();
  });

  // processes recorded data after recording is stopped
  mediaRecorder.addEventListener("stop", () => {
    // Original working for playback. Leaving just to show the method simpler than audioBuffer:
    // const audioBlob = new Blob(audioChunks);
    // const audioUrl = URL.createObjectURL(audioBlob);
    // const audio = new Audio(audioUrl);

    // Add the current recording to the overall recording list
    // Note the shallow copy! [...array]
    audioChunksArray.push([...audioChunks]);

    // update the checkboxes in the html document
    checkboxManager();

  });
});

// update the checkboxes in the html document
function checkboxManager(){
  var text = "";
  for (i = 0; i < audioChunksArray.length; ++i){
    text += "<input type=\"checkbox\" id=\"box" + i + "\" name=\"z\" value=\"" + i + "\"><br>";
  }
  var node = document.getElementById('recordlist');
  node.innerHTML = text;
}

// helper function to only play selected audio
function playSomething(){
  for (i = 0; i < audioChunksArray.length; ++i){
    var idname = "box" + i;

    // only process (play) checked items
    if (document.getElementById(idname).checked){
      // converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer
      process(audioChunksArray[i]);
    }
  }
}

// converts the (array of audio data) audiochunks -> blob -> url -> arrayBuffer -> audioBuffer 
function process(data) {
  const blob = new Blob(data);

  console.log(blob)
  
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
  // document.getElementById("play").addEventListener("click", function(){sourceNode.start()});
  sourceNode.start();
}


