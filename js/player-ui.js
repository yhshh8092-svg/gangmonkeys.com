const content = document.getElementById('content');
const playBtn = document.getElementById('play-pause');
let playing = false;

function renderHome(){
  let html = '<h2>Good evening</h2><div class="grid">';
  MOCK.albums.forEach(a=>{
    html += `
      <div class="card" style="padding:1rem;border-radius:8px;margin:.5rem;cursor:pointer">
        <img src="${a.img}" style="width:100%;border-radius:4px;">
        <div style="margin-top:.5rem;font-weight:600">${a.name}</div>
        <div style="opacity:.7;font-size:.8rem">${a.artist}</div>
      </div>`;
  });
  html += '</div>';
  content.innerHTML = html;
}
function renderSearch(){
  content.innerHTML = `<h2>Search</h2><input type="text" placeholder="What do you want to listen to?" style="width:100%;padding:.7rem;border-radius:20px;border:none;background:var(--card);color:var(--fg);">`;
}
function renderLibrary(){
  content.innerHTML = `<h2>Your Library</h2><p>Your saved music will appear here.</p>`;
}

document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click', e=>{
    document.querySelector('.nav-link.active').classList.remove('active');
    e.target.classList.add('active');
    const page = e.target.dataset.page;
    if(page==='home') renderHome();
    if(page==='search') renderSearch();
    if(page==='library') renderLibrary();
  });
});

playBtn.addEventListener('click', ()=>{
  playing = !playing;
  playBtn.textContent = playing ? '⏸' : '▶';
});

// kick off
renderHome();
