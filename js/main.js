const audioList = JSON.parse(songs)
const shuffleBtn = document.querySelector('.buttons_shuffle-button')
const loopBtn = document.querySelector('.buttons_loop-button')
const progressBar = document.querySelector('.bar_part')
const currentTimeHTML = document.querySelector('.bar_start-time')
const durationTimeHTML = document.querySelector('.bar_end-time')
const fullBar = document.querySelector('.bar_full')

function setupAudio() {
  let audioHTML = ``
  const audio = document.querySelector('.songs-list')

  audioList.forEach((song, index) => {
    audioHTML += `
    <div class="audio grid">
      <button data-index="${index} " class="data-button">
        <img src="./img/covers/${song.album}.jpg" class="audio-cover loading="lazy">
      </button>
      
      <div class="audio-info">
        <div class="audio-title">
          ${song.title}
        </div>
        <div class="audio-author">
          ${song.artist}
        </div>
      </div>
      <button data-index="${index}" class="like-button">
        <img src="img/heart.svg" alt="" class="like-button-img">
      </button>
    </div>
    `
  });

  audio.innerHTML = audioHTML
}

setupAudio()

function setupFooterAudio(song, index = 0) {
  const footerSong = document.querySelector('.song')
  footerSong.setAttribute('data-songname', `${song.name}`)
  footerSong.setAttribute('data-index', `${index}`)
  footerSong.innerHTML = `
  <img src="./img/covers/${song.album}.jpg" class="song_cover loading="lazy">
      <div class="song__text-info">
        <div class="song__text-info_title">
          ${song.title}
        </div>
        <div class="song__text-info_author">
          ${song.artist}
        </div>
      </div>
  `
}

setupFooterAudio(audioList[0])

function getFooterAudio() {
  const footerSong = document.querySelector('.song')
  return footerSong.getAttribute('data-songname')
}

function getFooterIndex() {
  const footerSong = document.querySelector('.song')
  return Number(footerSong.getAttribute('data-index'))
}

const player = document.querySelector('.js-audio')

function playSong() {
  const footerSong = getFooterAudio()
  player.src = `audio/${footerSong}`
  player.classList.add('play')
  player.play()
}

function pauseSong() {
  player.classList.remove('play')
  player.pause()
}

const swapBtn = document.querySelector('.buttons_play-button')
const playBtn = document.querySelector('.buttons__container_play-button')
playBtn.addEventListener('click', () => {
  const isPlaying = player.classList.contains('play')
  if (isPlaying) {
    pauseSong()
    swapBtn.src = "img/play.svg"
  }
  else {
    playSong()
    swapBtn.src = "img/pause.svg"
  }
})

function nextSong() {
  let index = getFooterIndex()
  if (shuffleBtn.classList.contains('shuffled')) {
    index = Math.floor(Math.random() * audioList.length)
  } else {
    if (index + 1 === audioList.length) {
      index = 0
    } else {
      index += 1
    }
  }
  console.log(index)
  setupFooterAudio(audioList[index], index)
  const isPlaying = player.classList.contains('play')
  if (isPlaying)
    playSong()
}

const nextBtn = document.querySelector('.buttons__container_next-button')

nextBtn.addEventListener('click', () => {
  nextSong()
})

function prevSong() {
  let index = getFooterIndex()
  if (index - 1 < 0) {
    index = audioList.length - 1
  } else {
    index -= 1
  }
  setupFooterAudio(audioList[index], index)
  const isPlaying = player.classList.contains('play')
  if (isPlaying)
    playSong()
}

const prevBtn = document.querySelector('.buttons__container_prev-button')

prevBtn.addEventListener('click', () => {
  prevSong()
})

shuffleBtn.addEventListener('click', () => {
  if (!shuffleBtn.classList.contains('shuffled')) {
    shuffleBtn.src = 'img/shuffle-on.svg'
    shuffleBtn.classList.add('shuffled')
  } else {
    shuffleBtn.src = 'img/shuffle.svg'
    shuffleBtn.classList.remove('shuffled')
  }
})

loopBtn.addEventListener('click', () => {
  if (!loopBtn.classList.contains('looped')) {
    loopBtn.src = 'img/loop-on.svg'
    loopBtn.classList.add('looped')
  } else {
    loopBtn.src = 'img/loop.svg'
    loopBtn.classList.remove('looped')
  }
})

player.addEventListener('ended', () => {
  if (loopBtn.classList.contains('looped')) {
    playSong()
  }
  else {
    nextSong()
  }
})

function to2String(num) {
  if (num < 10)
    return `0${num}`
  else
    return `${num}`
}

let duration = 0;
player.volume = 0.5;

function updateProgress(event) {
  duration = event.srcElement.duration
  const currentTime = event.srcElement.currentTime
  const progressPercent = currentTime / duration * 100
  durationTimeHTML.innerHTML = `${Math.floor(duration / 60)}:${to2String(Math.floor(duration % 60))}`
  currentTimeHTML.innerHTML = `${Math.floor(currentTime / 60)}:${to2String(Math.floor(currentTime % 60))}`
  progressBar.style.width = `${progressPercent}%`
}

player.addEventListener('timeupdate', updateProgress)

function setProgress(event) {
  const width = this.clientWidth
  const clickX = event.offsetX
  player.currentTime = (clickX / width) * duration
}

fullBar.addEventListener('click', setProgress)

const volumeBar = document.querySelector('.footer__volume_full')

function setVolume(event) {
  const width = this.clientWidth
  const clickX = event.offsetX
  player.volume = clickX / width
}

volumeChangeBar = document.querySelector('.footer__volume_part')

function updateVolume(event) {
  const volume = player.volume
  volumeChangeBar.style.width = `${volume * 100}%`
}

player.addEventListener('volumechange', updateVolume)

volumeBar.addEventListener('click', setVolume)

const likedSection = document.querySelector('.liked-songs-list')

function addLikes(btn) {
  const index = btn.getAttribute('data-index')
  btn.innerHTML = `<img src="./img/heart-active.svg" class="like-button-img">`
  const song = audioList[index]
  btn.classList.add('liked')
  likedSection.innerHTML += `
    <div class="audio">
      <button data-index="${index}" class="data-button">
        <img src="./img/covers/${song.album}.jpg" class="audio-cover loading="lazy">
      </button>
      <div class="audio-info">
        <div class="audio-title">
          ${song.title}
        </div>
        <div class="audio-author">
          ${song.artist}
        </div>
      </div>
      <button data-index="${index} "class="like-button liked">
        <img src="./img/heart-active.svg" class="like-button-img">
      </button>
    </div>
  `
  setPlay()
}

const songButtons = document.querySelectorAll('.like-button')
songButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    addLikes(btn)
  })
})

function setPlay() {
  const dataButtons = document.querySelectorAll('.data-button')
  dataButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index')
      setupFooterAudio(audioList[Number(index)], index)
      const isPlaying = player.classList.contains('play')
      if (isPlaying)
        pauseSong()
      playSong()
      swapBtn.src = "img/pause.svg"
    })
  })
}

setPlay()
