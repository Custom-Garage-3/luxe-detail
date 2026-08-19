/* ============================================================
   LUXERE — 全ページ共通スクリプト
   ヘッダー背景 / バーガーメニュー / スクロール表示 / FAQ開閉
   何かで落ちても本文が消えないよう、全体を try/catch で包む。
   ============================================================ */
(function () {
  try {
    /* ---------- ヘッダー：スクロールで背景を出す ---------- */
    var hd = document.getElementById('hd');
    if (hd) {
      var onScroll = function () { hd.classList.toggle('solid', window.scrollY > 40); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- バーガーメニュー ---------- */
    var burger = document.getElementById('burger');
    if (burger) {
      var close = function () {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      };
      burger.addEventListener('click', function () {
        var open = document.body.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      var ov = document.getElementById('ov');
      if (ov) {
        var links = ov.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) links[i].addEventListener('click', close);
      }
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    /* ---------- FAQ アコーディオン ---------- */
    var qs = document.querySelectorAll('.faq-q');
    for (var j = 0; j < qs.length; j++) {
      (function (q) {
        var item = q.closest('.faq-item');
        if (!item) return;
        q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
        q.addEventListener('click', function () {
          var open = item.classList.toggle('open');
          q.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      })(qs[j]);
    }

    /* ---------- スクロールで順に表示 ---------- */
    var items = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) {
      for (var k = 0; k < items.length; k++) items[k].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    for (var m = 0; m < items.length; m++) io.observe(items[m]);
  } catch (e) {
    /* 何かあっても本文が消えないようにする */
    document.documentElement.classList.add('no-js');
  }
})();
