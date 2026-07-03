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

// GoatCounter — same endpoint as the homepage, so subpage views are counted too (#12).
// Loaded here (shared by every talk subpage) instead of duplicating the snippet per file.
// GoatCounter skips localhost by default, so this only records on the live domain.
window.goatcounter = { endpoint: 'https://ultrathink.goatcounter.com/count' };
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);
})();
