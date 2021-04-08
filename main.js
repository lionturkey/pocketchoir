
// // Creating AudioContext to make audio buffers possible later on
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

import {makeRecordTab} from './modules/record.js'

var lagInterval = 100;
var project = "upload-clip";
var globalSampleRate = 0;
var serverAddress = "http://127.0.0.1:5000/api";

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
    projectid: project
};

// start with project hidden
loginDiv = document.getElementById("login")
projectDiv = document.getElementById("project")
projectDiv.style.display = "none";

// upon login, go to recordTab
var loginButt = document.getElementById("login-button");
loginButt.onclick = function(){

    ctx["username"] = document.getElementById("username").value;
    ctx["project"] = document.getElementById("projectName").value;

    initialLoad(ctx);
    loginDiv.style.display = "none";
    projectDiv.style.display = "inline";
    makeRecordTab(ctx);
}

