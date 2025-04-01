// Global variables
let currentSong = new Audio();
let songs = [];
let currFolder;

// Format time function for displaying song duration
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Get base URL for GitHub Pages
function getBaseURL() {
  const repoName = 'spotify'; // GitHub repository name
  const baseURL = window.location.hostname.includes('github.io') 
    ? `/${repoName}/` 
    : '/';
  return baseURL;
}

// Hardcoded song data for GitHub Pages since directory listing isn't available
const songFolders = {
  'cool': {
    title: 'Cool Vibes',
    description: 'Relaxing cool songs for a chill day',
    songs: ['song1.mp3', 'song2.mp3', 'song3.mp3']
  },
  'raging': {
    title: 'Raging Beats',
    description: 'Energetic songs to pump you up',
    songs: ['song1.mp3', 'song2.mp3', 'song3.mp3']
  },
  'relax': {
    title: 'Relaxation',
    description: 'Calm music for meditation and relaxation',
    songs: ['song1.mp3', 'song2.mp3', 'song3.mp3']
  },
  'warm': {
    title: 'Warm Tones',
    description: 'Cozy songs for a warm atmosphere',
    songs: ['song1.mp3', 'song2.mp3', 'song3.mp3']
  }
};

// Function to load songs for a folder
async function getSongs(folderName) {
  // Extract folder name from the path
  const folder = folderName.split('/').pop();
  currFolder = folderName;
  
  // Get songs from our hardcoded data (GitHub Pages doesn't support directory listing)
  songs = songFolders[folder]?.songs || [];
  
  // Update the UI with the song list
  let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
  songUL.innerHTML = "";
  
  const baseURL = getBaseURL();
  
  // Add each song to the UI
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img src="${baseURL}svgs/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img src="${baseURL}svgs/p.svg" alt="">
        </div>
      </li>`;
  }
  
  // Add click event listeners to each song
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach((e, index) => {
    e.addEventListener("click", () => {
      playMusic(songs[index]);
    });
  });
  
  return songs;
}

// Function to play music
const playMusic = (track, pause = false) => {
  if (!track) return;
  
  const baseURL = getBaseURL();
  currentSong.src = `${baseURL}songs/${currFolder.split('/').pop()}/${track}`;
  
  if (!pause) {
    currentSong.play().catch(e => console.error("Error playing song:", e));
    play.src = `${baseURL}svgs/pause.svg`;
  }
  
  document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Function to display albums
function displayAlbums() {
  const cc = document.querySelector('.cardContainer');
  cc.innerHTML = ""; // Clear existing content
  
  const baseURL = getBaseURL();
  
  // Create cards for each album using our hardcoded data
  Object.entries(songFolders).forEach(([folder, data]) => {
    cc.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="55" height="55"
              color="#000000" fill="none">
              <circle cx="12" cy="12" r="9" fill="green" />
              <path d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                  fill="black" />
          </svg>
        </div>
        <img src="${baseURL}songs/${folder}/cover-img.jpg" onerror="this.src='${baseURL}svgs/music.svg'">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
      </div>`;
  });
  
  // Add click event listeners to album cards
  setupAlbumCardListeners();
}

// Set up event listeners for album cards
function setupAlbumCardListeners() {
  // Update library header when card is clicked
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      const folderName = this.getAttribute('data-folder');
      const libraryHeader = document.querySelector('.libraryHeader');
      libraryHeader.innerHTML = '-  ' + folderName.replaceAll("%20", " ");
    });
  });
  
  // Load playlist when card is clicked
  Array.from(document.getElementsByClassName('card')).forEach((e) => {
    e.addEventListener('click', async () => {
      const baseURL = getBaseURL();
      const folderPath = `songs/${e.dataset.folder}`;
      await getSongs(folderPath);
      if (songs && songs.length > 0) {
        playMusic(songs[0]);
      }
    });
  });
}

// Main function
async function main() {
  const baseURL = getBaseURL();
  
  // Get the initial song list
  await getSongs('songs/cool');
  if (songs && songs.length > 0) {
    playMusic(songs[0], true);
  }
  
  // Display all albums
  displayAlbums();
  
  // Set up event listeners for the music player
  setupPlayerListeners();
}

// Set up event listeners for the music player
function setupPlayerListeners() {
  const baseURL = getBaseURL();
  
  // Update time display and seekbar
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    
    if (!isNaN(currentSong.duration)) {
      const currentPercent = (currentSong.currentTime / currentSong.duration) * 100;
      document.querySelector('.seekbar').value = currentPercent;
    }
  });
  
  // Handle seekbar changes
  document.querySelector('.seekbar').addEventListener("input", (e) => {
    const percent = e.target.value;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  
  // Play/pause button
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play().catch(e => console.error("Error playing song:", e));
      play.src = `${baseURL}svgs/pause.svg`;
    } else {
      currentSong.pause();
      play.src = `${baseURL}svgs/play.svg`;
    }
  });
  
  // Previous button
  previous.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').pop());
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  
  // Next button
  next.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').pop());
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  
  // Volume control
  const volumeInput = document.querySelector('.range');
  const volumeIcon = document.querySelector('.volume > img');
  
  // Set default volume
  volumeInput.value = 10;
  currentSong.volume = 0.2;
  
  // Volume change event
  volumeInput.addEventListener('change', (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
      volumeIcon.src = `${baseURL}svgs/volume.svg`;
    }
  });
  
  // Mute/unmute
  volumeIcon.addEventListener('click', (e) => {
    if (e.target.src.includes('volume.svg')) {
      e.target.src = `${baseURL}svgs/mute.svg`;
      currentSong.volume = 0;
      volumeInput.value = 0;
    } else {
      e.target.src = `${baseURL}svgs/volume.svg`;
      currentSong.volume = 0.1;
      volumeInput.value = 10;
    }
  });
  
  // Mobile menu
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
  });
  
  document.querySelector('.closeSvg').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-140%';
  });
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', main);
