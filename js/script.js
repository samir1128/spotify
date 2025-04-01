// .htaccess
/*Options +Indexes
IndexOptions FancyIndexing NameWidth=* DescriptionWidth=*
*/

// console.log(`we're going on`)

/*---------min:sec function------------*/
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`;
};
/*---------min:sec function ENDS------------*/

//global variables
let currentSong = new Audio();
let songs;
let currFolder;

// Base URL for GitHub repository
const baseURL = window.location.pathname.includes('spotify') 
  ? './' 
  : './spotify/';

//classic fetch from local storage
async function getSongs(folder) {
  //FETCH FOLDERS
  currFolder = folder;
  // Modify fetch URL to work with GitHub Pages
  let a = await fetch(`${folder}/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement('div');
  div.innerHTML = response;
  let as = div.getElementsByTagName('a');
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    console.log(element);
    if (element.href.endsWith('.mp3')) {
      // Extract only the filename from the full URL
      const songPath = element.href.split('/').pop();
      songs.push(songPath);
    }
  };
  //FETCH FOLDERS ENDS

  //later Moved here from down
  //show all the songs in the playlist
  let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
  songUL.innerHTML = "";
  console.log(songs);
  const songHeader = document.createElement('div');

  //SONG OF SONGS FOR LOOP
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img src="${baseURL}svgs/music.svg" alt="">
        <div class="info">
            <div>${decodeURIComponent(song).replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="${baseURL}svgs/p.svg" alt="">
        </div>
      </li>`;
  };
  //SONG OF SONGS FOR LOOP ENDS

  //Attach an eventListener to each song
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach(e => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
    });
  });
  //Attach an eventListener to each song ENDS

  return songs;
}

/*-------- --------**/
//play music function
const playMusic = (track, pause = false) => {
  // Construct proper path for GitHub environment
  currentSong.src = `${currFolder}/${encodeURIComponent(track)}`;
  if (!pause) {
    currentSong.play();
    play.src = `${baseURL}svgs/pause.svg`;
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
//play music function ENDS

//DISALBUM FUNCTION
async function disAlbum() {
  //FETCH FOLDERS ARRAY
  // Use GitHub compatible path
  let a = await fetch(`${baseURL}songs/`);
  let response = await a.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let anchors = div.getElementsByTagName('a');
  const cc = document.querySelector('.cardContainer');
  let Arr = Array.from(anchors);
  //FETCH FOLDERS ARRAY ENDS

  //FOR LOOP CARD CONTAINER
  for (let i = 0; i < Arr.length; i++) {
    const en = Arr[i];
    // Check if it's a folder in the songs directory
    if (en.href.includes('/songs/') && !en.href.endsWith('.mp3') && !en.href.endsWith('.jpg') && !en.href.endsWith('.json')) {
      // Extract folder name from URL
      let folder = en.href.split('/').pop().replace('/', '');
      if (!folder) continue; // Skip if folder name is empty
      
      console.log(folder);

      //get metadata of the folder
      try {
        let a = await fetch(`${baseURL}songs/${folder}/info.json`);
        let response = await a.json();
        console.log(response);

        //CC.INNERHTML
        cc.innerHTML = cc.innerHTML + `
         <div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="55" height="55"
                    color="#000000" fill="none">
                    <!-- Reduced the radius to create padding -->
                    <circle cx="12" cy="12" r="9" fill="green" />
                    <path
                        d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                        fill="black" />
                </svg>
            </div>

            <img src="${baseURL}songs/${folder}/cover-img.jpg">

            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`;
          //CC.INNERHTML ENDS
      } catch (error) {
        console.error(`Error loading info for folder ${folder}:`, error);
      }
    }; //IF ENDS
  };//FOR LOOP ENDS
  //FOR LOOP CARD CONTAINER ENDS

  //LIBRARY HEADER
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function () {
      // Get the folder name from the data attribute
      const folderName = this.getAttribute('data-folder');

      // Update the library header
      const libraryHeader = document.querySelector('.libraryHeader');
      libraryHeader.innerHTML = '-  ' + decodeURIComponent(folderName).replaceAll('%20', ' ');
    });
  });
  //LIBRARY HEADER ENDS

  //LOAD PLAYLIST WHEN CARD CLICKED
  Array.from(document.getElementsByClassName('card')).forEach((e) => {
    e.addEventListener('click', async (e) => {
      const folderPath = `${baseURL}songs/${e.currentTarget.dataset.folder}`;
      songs = await getSongs(folderPath);
      if (songs && songs.length > 0) {
        playMusic(songs[0]);
      }
    });
  });
  //LOAD PLAYLIST WHEN CARD CLICKED ENDS
};
//DISALBUM FUNCTION ENDS

//MAIN FUNCTION
async function main() {
  // get the song list
  await getSongs(`${baseURL}songs/cool`);
  if (songs && songs.length > 0) {
    playMusic(songs[0], true);
  }

  //Display all the albums on the page
  disAlbum();

  //listen for timeupdate
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
  });
  //listen for timeupdate ENDS

  // Update seekbar as the song plays
  currentSong.addEventListener('timeupdate', () => {
    if (!isNaN(currentSong.duration)) {
      const currentPercent = (currentSong.currentTime / currentSong.duration) * 100;
      document.getElementsByClassName('seekbar')[0].value = currentPercent;
    }
  });
  // Update seekbar as the song plays ENDS

  // Listen for seekbar changes (user drags or clicks)
  document.getElementsByTagName('input')[1].addEventListener("input", (e) => {
    const percent = e.target.value;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // Listen for seekbar changes (user drags or clicks) ENDS

  // Attach an eventListener to play
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = `${baseURL}svgs/pause.svg`;
    } else {
      currentSong.pause();
      play.src = `${baseURL}svgs/play.svg`;
    }
  });
  // Attach an eventListener to play ENDS

  //Attach an eventListener to next & previous
  previous.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').pop());
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').pop());
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  //Attach an eventListener to next & previous ENDS

  //setVolume    
  const volumeInput = document.querySelector('.range');
  const volumeIcon = document.querySelector('.volume > img');

  // Set default volume to 10%
  volumeInput.value = 10;
  currentSong.volume = 0.2;

  // //Add an event to volume
  volumeInput.addEventListener('change', (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;

    if (currentSong.volume > 0) {
      volumeIcon.src = volumeIcon.src.replace('mute.svg', 'volume.svg');
    }
  });
  //setVolume ENDS

  // hamburger
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
  });
  // hamburger ENDS

  // close
  document.querySelector('.closeSvg').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-140%';
  });
  // close ENDS

  //mute volume
  document.querySelector('.volume>img').addEventListener('click', (e) => {
    if (e.target.src.includes('volume.svg')) {
      e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
      currentSong.volume = 0;
      document.querySelector('.range').value = 0;
    } else {
      e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
      currentSong.volume = 0.1;
      document.querySelector('.range').value = 10;
    }
  });
  //mute volume ENDS
};
//MAIN FUNCTION ENDS

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', main);
