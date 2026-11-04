/* ==========================================================
   common.js — 全ページ共通
   ・読み込み演出の開始
   ・ヘッダーのスクロール状態
   ・スマホメニュー
   ・スクロールで表示（.reveal）
   ========================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js-reveal');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 読み込み演出 ---------- */
  function startIntro() {
    window.requestAnimationFrame(function () {
      root.classList.add('is-loaded');
    });
  }

  if (document.fonts && document.fonts.ready) {
    // フォントの読み込みを最大 1.2 秒だけ待ってから開始
    var started = false;
    var go = function () {
      if (started) return;
      started = true;
      startIntro();
    };
    document.fonts.ready.then(go);
    window.setTimeout(go, 1200);
  } else {
    startIntro();
  }

  /* ---------- ヘッダー ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- スマホメニュー ---------- */
  var menuButton = document.querySelector('.menu-button');
  var nav = document.getElementById('global-nav');
  if (menuButton && nav) {
    var setMenu = function (open) {
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('is-menu-open', open);
    };

    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuButton.focus();
      }
    });
  }

  /* ---------- スクロールで表示 ---------- */
  var targets = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(function (el) {
    observer.observe(el);
  });

  // 念のため：3 秒たっても表示されていない要素は、画面内にあれば表示
  window.setTimeout(function () {
    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
  }, 3000);
})();
