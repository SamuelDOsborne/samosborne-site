/* Mobile menu for the site-wide nav (see css/site-nav.css). */
(function () {
  var t = document.getElementById('sitenavToggle');
  var l = document.getElementById('sitenavLinks');
  if (!t || !l) return;
  function set(open) {
    l.classList.toggle('active', open);
    t.innerHTML = open ? '&#10005;' : '&#9776;';
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  t.addEventListener('click', function () { set(!l.classList.contains('active')); });
  l.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
})();
