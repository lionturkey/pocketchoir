
import { 
    playGarbaj,
    stopPlaying,
    deleteSomething,
    downloadSomething,
    mergeSomething,
    startTimer,
    stopTimer
} from './utilities.js';
import { makeRecordTab} from './record.js';

export function makeEditTab(ctx) {
    showEditTab();

    // Grab the available buttons
    var playButt = document.getElementById("play");
    var delButt = document.getElementById("delete");
    var downButt = document.getElementById("download");
    var mergeButt = document.getElementById("merge");
    var recordTab = document.getElementById("recordtab");

    playButt.onclick = function() {
        console.log("Start playing")
        playGarbaj(ctx);
        startTimer();
        // TODO: add functionality to switch back to play image
        // after buffer duration
        playButt.src = "/static/images/play_stop_u13.svg"

        playButt.onclick = function() {
            stopPlaying(ctx);
            stopTimer();
            playButt.src = "/static/images/play_u3.svg"
            // reset tab
            makeEditTab(ctx);
        }
    };

    delButt.onclick = () => (deleteSomething(ctx));

    downButt.onclick = () => (downloadSomething(ctx));

    mergeButt.onclick = () => (mergeSomething(ctx));

    recordTab.onclick = () => (makeRecordTab(ctx));

};

function showEditTab() {
    // hide record functionality and change to edit mode!
    document.getElementById("record").style.display = "none";
    document.getElementById("play").style.display = "inline";
    document.getElementById("delete").style.display = "inline";
    document.getElementById("download").style.display = "inline";
    document.getElementById("merge").style.display = "inline";
};




