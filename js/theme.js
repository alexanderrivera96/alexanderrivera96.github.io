// Site script. Loaded in <head> so the saved theme applies before first paint.
(function () {
  var root = document.documentElement;

  // ---- dark/light theme ----
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      });
    }

    // ---- menu bar clock ----
    var clock = document.querySelector('.clock');
    function tick() {
      if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 15000);

    // ---- scroll reveal ----
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }

    // ---- footer wordmark: "ciacx007" drawn in little folder blocks ----
    var host = document.querySelector('.wordmark');
    if (host) host.innerHTML = buildWordmark('ciacx007');
  });

  var GLYPHS = {
    c: ['.....', '.....', '.###.', '#....', '#....', '#....', '.###.'],
    i: ['..#..', '.....', '.##..', '..#..', '..#..', '..#..', '.###.'],
    a: ['.....', '.....', '.###.', '....#', '.####', '#...#', '.####'],
    x: ['.....', '.....', '#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
    0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...']
  };

  function buildWordmark(text) {
    var cell = 10, gap = 1.2, size = cell - gap, cols = 0, parts = [];
    text.split('').forEach(function (ch, n) {
      var g = GLYPHS[ch];
      if (!g) return;
      var x0 = n * 6;
      g.forEach(function (row, y) {
        row.split('').forEach(function (bit, x) {
          if (bit !== '#') return;
          var px = (x0 + x) * cell, py = y * cell + 2;
          parts.push('<rect class="tab" x="' + (px + 0.6) + '" y="' + (py - 1.6) + '" width="' + (size * 0.42) + '" height="2.4" rx="1"/>');
          parts.push('<rect x="' + px + '" y="' + py + '" width="' + size + '" height="' + size + '" rx="1.6"/>');
        });
      });
      cols = x0 + 5;
    });
    var w = cols * cell, h = 7 * cell + 2;
    return '<svg viewBox="0 -1 ' + w + ' ' + h + '" role="img" aria-label="ciacx007">' +
      '<defs><linearGradient id="blk" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" style="stop-color:var(--block-a)"/><stop offset="1" style="stop-color:var(--block-b)"/>' +
      '</linearGradient></defs>' + parts.join('') + '</svg>';
  }
})();
