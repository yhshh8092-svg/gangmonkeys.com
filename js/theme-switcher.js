const sel = document.getElementById('theme-select');
sel.addEventListener('change', e=>{
  document.documentElement.setAttribute('data-theme', e.target.value);
});
