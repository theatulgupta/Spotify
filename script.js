let currentSong = new Audio();
let songs;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + decodeURI(track);
    if (!pause) {
        currentSong.play();
        playsong.src = "assets/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".duration").innerHTML = "00:00/00:00"
}

async function main() {
    songs = await getSongs();
    playMusic(songs[0], true)

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML += `
            <li class="flex ic">
                <img class="invert" src="assets/music.svg" alt="Music" />
                <div class="info">
                  <div class="song-name truncate">${song.replaceAll("%20", " ")}</div>
                  <div class="artist">Atul Gupta</div>
                </div>
                <span>Play Now</span>
                <img class="invert" src="assets/playsong.svg" alt="Play" />
            </li>`;
    }
    // Attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => { // corrected: arrow function with no parameter
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // Attach an event listener to play, next and previous
    playsong.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            playsong.src = "assets/pause.svg"
        } else {
            currentSong.pause();
            playsong.src = "assets/play.svg"
        }
    });

    // Listen for duration update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * currentSong.duration) / 100;
    });

    // Add an event for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })

    // Add an event for hamburger
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-" + 100 + "%";
    })

    // Add an event listener to prev
    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 > length) {
            playMusic(songs[index + 1]);
        }
    })
}

main();
