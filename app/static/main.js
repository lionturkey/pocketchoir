
// // Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

import { makeEditTab } from './modules/edit.js';
import { makeRecordTab} from './modules/record.js'
import { initialLoad, checkboxManager } from './modules/utilities.js'

var lagInterval = 290;
var project = "upload-clip";
var globalSampleRate = 0;
// var serverAddress = "http://127.0.0.1:5000/api";
var serverAddress = "api";

const ctx = {
    audioBufferArray: [],
    audioNameArray: [],
    selectedBuffers: [],
    serverAddr: serverAddress,
    project: "",
    username: "Tammy",
    audioCtx: audioContext,
    globalSR: globalSampleRate,
    lagInt: lagInterval,
    sourceNode: null,
    projectid: project,
};

// start with project hidden
var loginDiv = document.getElementById("login")
var projectDiv = document.getElementById("project")
var syncButton = document.getElementById("sync")
projectDiv.style.display = "none";

// upon login, go to recordTab
var loginButt = document.getElementById("login-button");
var projectNameInput = document.getElementById("projectName");

// Clicks login button when user hits enter
projectNameInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loginButt.click();
    }
});

loginButt.onclick = function() {
    ctx["username"] = document.getElementById("username").value;
    ctx["project"] = projectNameInput.value;

    if(ctx["username"] == "Janis"){
      ctx["lagInt"] = 290;
    }
    if(ctx["username"] == "Leo"){
      ctx["lagInt"] = 290;
    }


    document.getElementById("project-name").innerHTML = `${projectNameInput.value}`;
  
    if (ctx["username"] !== "" && ctx["project"] !== "") {
        initialLoad(ctx);
        loginDiv.style.display = "none";
        projectDiv.style.display = "flex";
        
        var recordTab = document.getElementById("recordtab");
        recordTab.className += " active"
        makeRecordTab(ctx);

        
    }
}


// var time0 = performance.now();
// // Create 1 second silent audio buffer
// var calibrationBuff = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
// var node = audioContext.createBufferSource();
// node.buffer = calibrationBuff;
// node.connect(audioContext.destination);

// // start timer and then start node
// var time1;
// node.start();

// // see how long it takes
// node.addEventListener('ended', () => {
//   time1 = performance.now();
//   console.log("source node took " + (time1 - time0) + " milliseconds.");
//   ctx["lagInt"] = (time1 - time0 - 700);
//   console.log("lag int is " + ctx["lagInt"]);
//   // node.disconnect();
// })



// setTimeout(() => (node.removeEventListener('ended', () => {
//   time1 = performance.now();
//   console.log("source node took " + (time1 - time0) + " milliseconds.");
//   ctx["lagInt"] = (time1 - time0 - 700);
//   console.log("lag int is " + ctx["lagInt"]);
// })), 2000);


syncButton.onclick = function() {
  console.log("syncing..")
  ctx.audioBufferArray = []
  ctx.audioNameArray = []
  ctx.selectedBuffers = []
  initialLoad(ctx);
  checkboxManager(ctx);
  console.log("synced!")
}

navigator.mediaDevices.getUserMedia({ audio: {
    // the below audio options prevent the recording from cutting in and out while there is playback
    autoGainControl: false,
    echoCancellation: false,
    noiseSuppression: false
} })
      .then(async stream => {
        console.log('You let me use your mic!');
        ctx["stream"] = stream;
      })
      .catch(function(_) {
        console.log('No mic for you!');
      });

