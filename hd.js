const audio = document.getElementById("audio");
const playPause = document.getElementById("play");
const timeEnd = document.querySelector(".end");
const timeStart = document.querySelector(".start");
let timer
let currentTime = 0;

playPause.addEventListener("click", () => {
  if (audio.paused || audio.ended) {
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
    audio.play();
  } else {
    audio.pause();
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
  }
});

audio.onloadeddata = function() {
    let duration = audio.duration;
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);

    // Agrega un 0 a la izquierda si los segundos son menos de 10
    let formattedTime = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    
    console.log(formattedTime);
    timeEnd.innerHTML=formattedTime

    function startTimer() {
         timer = setInterval(function() {
            let currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds = Math.floor(currentTime % 60);
    
            var formattedCurrentTime = currentMinutes + ":" + (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
            timeStart.innerHTML=formattedCurrentTime
    
            // Si el tiempo actual es igual a la duración del audio, detener el temporizador
            if (currentTime >= duration) {
                clearInterval(timer);
            }
            
            currentTime++;
        }, 1000);
    }


    // Inicia el temporizador cuando se empieza a reproducir el audio
    audio.onplay = function() {
        startTimer();
    };

    // Detiene el temporizador cuando se pausa el audio
    audio.onpause = function() {
        clearInterval(timer);
    };

    // Reinicia el temporizador cuando se reinicia el audio
    audio.onseeked = function() {
        currentTime = Math.floor(audio.currentTime);
    };
 
};

