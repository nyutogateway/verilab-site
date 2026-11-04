/* ==========================================================
   hero.js — TOP ヒーローのスライダー
   .hero-slide を一定間隔でクロスフェードし、
   番号表示（01 / 03）・進行バー・前後ボタンを同期させる
   あわせて、見出し下のキーワードをタイプライター表示する
   ========================================================== */

/* ---------- 大きな英字を1文字ずつ表示 ---------- */
(function () {
  'use strict';

  var display = document.querySelector('[data-letters]');
  if (!display) return;

  // 各行の文字を span に分ける（JS が動かない環境では分けずにそのまま表示）
  var chars = [];
  display.querySelectorAll('.hero-display__line').forEach(function (line) {
    var text = line.textContent;
    line.textContent = '';
    text.split('').forEach(function (c) {
      var span = document.createElement('span');
      span.className = 'hero-display__char';
      span.textContent = c;
      line.appendChild(span);
      chars.push(span);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    chars.forEach(function (span) {
      span.classList.add('is-on');
    });
    return;
  }

  var i = 0;
  function next() {
    if (i >= chars.length) return;
    chars[i].classList.add('is-on');
    i++;
    window.setTimeout(next, 70);
  }
  // 写真のフェードインに合わせて打ち始める
  window.setTimeout(next, 1200);
})();

/* ---------- タイプライター ---------- */
(function () {
  'use strict';

  var el = document.querySelector('[data-typewriter]');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var words = (el.getAttribute('data-words') || '').split('|');
  if (words.length < 2) return;

  var TYPE = 140;   // 1文字打つ間隔
  var ERASE = 60;   // 1文字消す間隔
  var HOLD = 2200;  // 打ち終わってから消し始めるまで
  var word = 0;
  var length = 0;
  var erasing = false;

  function tick() {
    var text = words[word];
    if (!erasing) {
      length++;
      el.textContent = text.slice(0, length);
      if (length === text.length) {
        erasing = true;
        window.setTimeout(tick, HOLD);
        return;
      }
      window.setTimeout(tick, TYPE);
    } else {
      length--;
      el.textContent = text.slice(0, length);
      if (length === 0) {
        erasing = false;
        word = (word + 1) % words.length;
      }
      window.setTimeout(tick, length === 0 ? 400 : ERASE);
    }
  }

  // 読み込み演出（見出しのフェード）が終わってから打ち始める
  el.textContent = '';
  window.setTimeout(tick, 2200);
})();

/* ---------- スライダー ---------- */
(function () {
  'use strict';

  var hero = document.querySelector('[data-hero]');
  if (!hero) return;

  var slides = hero.querySelectorAll('.hero-slide');
  var current = hero.querySelector('[data-hero-current]');
  var total = hero.querySelector('[data-hero-total]');
  var prev = hero.querySelector('[data-hero-prev]');
  var next = hero.querySelector('[data-hero-next]');
  var bar = hero.querySelector('.hero-progress__bar');
  var interval = Number(hero.getAttribute('data-interval')) || 6000;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var timer = null;

  var pad = function (n) {
    return (n < 10 ? '0' : '') + n;
  };

  // 進行バーの長さは top.css 側（6s）と data-interval を揃えておく
  if (total) total.textContent = pad(slides.length);

  function show(to) {
    to = (to + slides.length) % slides.length;
    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    slides[index].setAttribute('tabindex', '-1');
    index = to;
    slides[index].classList.add('is-active');
    slides[index].removeAttribute('aria-hidden');
    slides[index].removeAttribute('tabindex');
    if (current) current.textContent = pad(index + 1);
  }

  function restartBar() {
    if (!bar || reduceMotion) return;
    bar.classList.remove('is-running');
    // 再描画させてからアニメーションをやり直す
    void bar.offsetWidth;
    bar.classList.add('is-running');
  }

  // 自動再生（動きを減らす設定では止めて、ボタン操作だけにする）
  function start() {
    stop();
    if (reduceMotion) return;
    restartBar();
    timer = window.setInterval(function () {
      show(index + 1);
      restartBar();
    }, interval);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  if (slides.length < 2) {
    if (prev) prev.hidden = true;
    if (next) next.hidden = true;
    return;
  }

  if (prev) {
    prev.addEventListener('click', function () {
      show(index - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      start();
    });
  }

  start();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
})();
