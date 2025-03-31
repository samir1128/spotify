
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


//classic fetch from local storage
async function getSongs(folder) {

  //FETCH FOLDERS
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}`)
  let response = await a.text();
  // console.log(response)
  let div = document.createElement('div')
  div.innerHTML = response;
  let as = div.getElementsByTagName('a')
  songs = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    console.log(element)
    if (element.href.endsWith('.mp3')) {
      songs.push(element.href.split(`/${currFolder}/`)[1])
    }
  };
  //FETCH FOLDERS ENDS



  //later Moved here from down
  //show all the songs in the playlist
  let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
  songUL.innerHTML = "";
  console.log(songs)
  const songHeader = document.createElement('div')


  //SONG OF SONGS FOR LOOP
  for (const song of songs) {
    for (let i = 0; i < as.length; i++) {
      const element = as[i];
      console.log(element)
      if (element.href.endsWith('.mp3')) {
        console.log(element.href)
      }
    }
    songHeader.innerHTML =
      songUL.innerHTML = songUL.innerHTML + `
     
      <li>
                           <img src="svgs/music.svg" alt="">
                           <div class="info">
                               <div>${song.replaceAll("%20", " ")}</div>
                               
                           </div>
                           <div class="playnow">
                               <span>Play Now</span>
                               <img src="svgs/p.svg" alt="">
                           </div>
                       
     
     </li>`
  }; 
 //SONG OF SONGS FOR LOOP ENDS


  //Attach an eventListener to each song
  Array.from(
    document.querySelector('.songList').getElementsByTagName('li')
  ).forEach(e => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
    })
  });
  //Attach an eventListener to each song ENDS

  return songs

}


/*-------- --------**/
//play music function
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)

  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "svgs/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}
//play music function ENDS

//DISALBUM FUNCTION
async function disAlbum() {

  //FETCH FOLDERS ARRAY
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement('div')
  div.innerHTML = response;
  let anchors = div.getElementsByTagName('a')
  // console.log(Arr)
  const cc = document.querySelector('.cardContainer');
  let Arr = Array.from(anchors)
//FETCH FOLDERS ARRAY ENDS

  //FOR LOOP CARD CONTAINER
  for (let i = 0; i < Arr.length; i++) {
    const en = Arr[i];

    if (en.href.includes('/songs/')) {
      let folder = en.href.split('/').pop()

      console.log(folder)

      //get metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);

      let response = await a.json();
      console.log(response)

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

                        <img src="/songs/${folder}/cover-img.jpg">

                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                        </div>`
                        //CC.INNERHTML ENDS
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
      libraryHeader.innerHTML = '-  ' + folderName.replaceAll('%20', ' ');

    });
  });
    //LIBRARY HEADER ENDS



  //LOAD PLAYLIST WHEN CARD CLICKED
  Array.from(document.getElementsByClassName('card')).forEach((e) => {
    e.addEventListener('click', async (e) => {
      songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    })
  });
  //LOAD PLAYLIST WHEN CARD CLICKED ENDS


};
//DISALBUM FUNCTION ENDS


//MAIN FUNCTION
async function main() {
  // get the song list
  await getSongs('songs/ncs');
  playMusic(songs[0], true)


  //Display all the albums on the page
  disAlbum()



  //listen for timeupdate
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
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
    currentSong.currentTime = (currentSong.duration * percent) / 100
  });
// Listen for seekbar changes (user drags or clicks) ENDS


  // Attach an eventListener to play
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "svgs/pause.svg"
    } else {
      currentSong.pause()
      play.src = "svgs/play.svg"
    }
  });
   // Attach an eventListener to play ENDS


  //Attach an eventListener to next & previous
  previous.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })
  next.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
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
      volumeIcon.src = volumeIcon.src.replace('svgs/mute.svg', 'svgs/volume.svg');
    }
  });
  //setVolume ENDS


  // hamburger
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0';
  })
// hamburger ENDS


  // close
  document.querySelector('.closeSvg').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-140%'
  })
// close ENDS


  //mute volume
  document.querySelector('.volume>img').addEventListener('click', (e) => {

    if (e.target.src.includes('svgs/volume.svg')) {
      e.target.src = e.target.src.replace('svgs/volume.svg', 'svgs/mute.svg');
      currentSong.volume = 0;
      document.querySelector('.range').value = 0;
    } else {
      e.target.src = e.target.src.replace('svgs/mute.svg', 'svgs/volume.svg');
      currentSong.volume = 0.1;
      document.querySelector('.range').value = 10;
    }

  });
  //mute volume ENDS


};
//MAIN FUNCTION ENDS

// play the first song
// var audio = new Audio(songs[0]);
// await audio.play()





main()












/*
//  audio.addEventListener('loadeddata', ()=>{
    //   let duration= audio.duration;
    //   console.log(duration, audio.currentSrc, audio.currentTime)
    // })
/*
  //listen for timeupdate
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
     document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    // document.getElementsByTagName('input').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    });









*/

