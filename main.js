import { music as listMusic, music } from "./data.js";

const audio = document.getElementById("audio");
const playPause = document.getElementById("play");
const iconMenu = document.getElementById("icon-menu");
const timeEnd = document.querySelector(".end");
const timeStart = document.querySelector(".start");
const range = document.getElementById("range");
const playlist = document.querySelector(".playlist");
const list = document.querySelector(".playlist ul");
const artistElement = document.querySelector(".player__artist");
const nameSongElement = document.querySelector(".player__song");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");

let timer;
let pathMusic = "./music/";
let currentTime = 1;
let currentMusic = 1;
let duration;

iconMenu.addEventListener("click", () => {
  playlist.classList.toggle("open");
});

playPause.addEventListener("click", () => {
  if (audio.paused || audio.ended) {
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
    audio.play();
  } else {
    audio.pause();
    clearInterval(timer);
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
  }
});

function setupMusic(file, name, artist, id) {
  currentTime = 1;
  clearInterval(timer);
  audio.pause();
  range.value = 0;
  timeStart.innerHTML = "0:00";
  audio.src = `${pathMusic}${file}`;
  audio.play();

  nameSongElement.innerHTML = name;
  artistElement.innerHTML = artist;
  currentMusic = id;
}

function validationMusic() {
  if (currentMusic <= 1) {
    backward.classList.add("blocked");
    backward.style.pointerEvents = "none";
    backward.style.opacity = "0.5";
  } else {
    backward.classList.remove("blocked");
    backward.style.pointerEvents = "auto";
    backward.style.opacity = "1";
  }

  if (currentMusic === listMusic.length) {
    forward.classList.add("blocked");
    forward.style.pointerEvents = "none";
    forward.style.opacity = "0.5";
  } else {
    forward.classList.remove("blocked");
    forward.style.pointerEvents = "auto";
    forward.style.opacity = "1";
  }
}

function initializeAudio() {
  duration = audio.duration;
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);

  let formattedTime = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  timeEnd.innerHTML = formattedTime;

  function startTimer() {
    timer = setInterval(function () {
      let currentMinutes = Math.floor(currentTime / 60);
      let currentSeconds = Math.floor(currentTime % 60);

      let formattedCurrentTime =
        currentMinutes +
        ":" +
        (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);

      timeStart.innerHTML = formattedCurrentTime;
      range.value = (currentTime / duration) * 100;
      currentTime++;

      if (currentTime > duration) {
        clearInterval(timer);
      }
    }, 1000);
  }

  audio.onplay = function () {
    startTimer();
  };
}

range.addEventListener("change", () => {
  let percentage = parseInt(range.value);
  let calculatedTime = Math.floor((percentage / 100) * duration);

  let minutes = Math.floor(calculatedTime / 60);
  let seconds = Math.floor(calculatedTime % 60);

  let formattedTime = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  audio.currentTime = calculatedTime;
  currentTime = calculatedTime;
  timeStart.innerHTML = formattedTime;
});

audio.onloadeddata = initializeAudio;

if (audio.readyState >= 0) {
  initializeAudio();
}

const itemsMusic = listMusic.map((music) => {
  const li = document.createElement("li");
  li.classList.add("item");
  li.dataset.id = music.id;
  li.dataset.name = music.name;
  li.dataset.artist = music.artist;
  li.dataset.file = music.file;

  li.innerHTML = `<p>${music?.name}</p><span><i class="fa-solid fa-play"></i></span>`;
  list.appendChild(li);

  return li;
});

itemsMusic.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const item = e.target.closest("li.item");
    if (item) {
      const dataset = item.dataset;
      const name = dataset.name;
      const artist = dataset.artist;
      const id = parseInt(dataset.id);
      const file = dataset.file;

      setupMusic(file, name, artist, id);

      validationMusic();
    }
  });
});

validationMusic();

backward.addEventListener("click", () => {
  const { id, name, artist, file } = listMusic.find(
    (music) => music.id == currentMusic - 1
  );

  if (!id || !name || !artist || !file) return;

  setupMusic(file, name, artist, id);
  validationMusic();
});

forward.addEventListener("click", () => {
  const { id, name, artist, file } = listMusic.find(
    (music) => music.id == currentMusic + 1
  );

  if (!id || !name || !artist || !file) return;

  setupMusic(file, name, artist, id);

  validationMusic();
});
