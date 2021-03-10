

// document.getElementById("stop").addEventListener("click", function(){console.log("BARF")});


navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
  const mediaRecorder = new MediaRecorder(stream);

  document.getElementById("start").addEventListener("click", function(){mediaRecorder.start()});

  const audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });



  mediaRecorder.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    document.getElementById("play").addEventListener("click", function(){audio.play()});
  });

  document.getElementById("stop").addEventListener("click", function(){mediaRecorder.stop()});
//   mediaRecorder.stop()

    // setTimeout(() => {
    //     mediaRecorder.stop();
    // }, 1000);

});













