// Progressive enhancement for talk subpages: click the video facade to play the
// talk inline via a privacy-friendly youtube-nocookie iframe (loaded only on click).
// Without JS, the .video element is a plain link that opens YouTube.
document.addEventListener('click', function (e) {
  var v = e.target.closest('.video[data-yt]');
  if (!v || v.dataset.playing) return;
  e.preventDefault();
  v.dataset.playing = '1';
  var f = document.createElement('iframe');
  f.className = 'video-frame';
  f.src = 'https://www.youtube-nocookie.com/embed/' + v.getAttribute('data-yt') + '?autoplay=1&rel=0';
  f.title = v.getAttribute('data-title') || 'Video';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.setAttribute('allowfullscreen', '');
  v.replaceWith(f);
});
