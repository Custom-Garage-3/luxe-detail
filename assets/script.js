/* ============================================================
   出張洗車LUXERE — script v3
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.body.classList.remove('menu-open');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .step').forEach(function (el) { io.observe(el); });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Hero card tilt ---------- */
  var tiltHost = document.querySelector('.hero-visual');
  var tiltCard = document.querySelector('.hero-card');
  if (tiltHost && tiltCard && !reduce && window.matchMedia('(hover:hover)').matches) {
    tiltHost.addEventListener('mousemove', function (e) {
      var r = tiltHost.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tiltCard.style.transform =
        'rotateY(' + (x * 9).toFixed(2) + 'deg) rotateX(' + (-y * 9).toFixed(2) + 'deg) translateZ(0)';
    });
    tiltHost.addEventListener('mouseleave', function () {
      tiltCard.style.transform = '';
    });
  }

  /* ============================================================
     水弾き ＋ 拭き上げ
     コーティング面に細かな水滴が結び、
     ときどきスキージーが一度だけ通って、また結びはじめる。
     ============================================================ */
  var cv = document.getElementById('drops');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var drops = [];
    var raf = null;

    // 拭き上げの状態機械： idle → wipe → idle
    var wipeX = -0.25;      // 0〜1 の進行度（-0.25 で待機）
    var wipeWait = 210;     // 待機フレーム
    var TILT = 0.16;        // スキージーの傾き

    function resize() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function makeDrop(x, y) {
      var rr = 0.8 + Math.pow(Math.random(), 3.1) * 9.5;   // 大半は極小、まれに大粒
      return {
        x: x != null ? x : Math.random() * W,
        y: y != null ? y : Math.random() * H,
        r0: rr,
        r: rr,
        vy: 0,
        wob: Math.random() * Math.PI * 2,
        a: 1,
        grow: 0.004 + Math.random() * 0.006
      };
    }

    function seed() {
      drops = [];
      var target = Math.round((W * H) / 8200);
      target = Math.max(70, Math.min(target, 260));
      for (var i = 0; i < target; i++) drops.push(makeDrop());
    }

    // スキージーの刃の位置（yごとに傾く）
    function bladeAt(y) {
      return wipeX * W * (1 + TILT) - TILT * W * (y / (H || 1));
    }

    function drawDrop(d) {
      var r = d.r, x = d.x, y = d.y, a = d.a;
      if (r < 0.35 || a <= 0.01) return;

      // 本体：ほぼ透明。ふちの屈折だけが見える
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.34, r * 0.05, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,' + (0.34 * a) + ')');
      g.addColorStop(0.55, 'rgba(255,255,255,' + (0.05 * a) + ')');
      g.addColorStop(0.88, 'rgba(168,206,230,' + (0.11 * a) + ')');
      g.addColorStop(1, 'rgba(255,255,255,' + (0.22 * a) + ')');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // 縁のハイライト（細く）
      if (r > 1.2) {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.97, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.30 * a) + ')';
        ctx.lineWidth = Math.max(0.4, r * 0.035);
        ctx.stroke();
      }
      // 鏡面反射の点
      if (r > 2.6) {
        ctx.beginPath();
        ctx.ellipse(x - r * 0.34, y - r * 0.38, r * 0.17, r * 0.11, -0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.6 * a) + ')';
        ctx.fill();
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // --- 拭き上げの進行 ---
      var wiping = wipeX >= -0.2 && wipeX <= 1.3;
      if (wiping) {
        wipeX += 0.0062;
        if (wipeX > 1.3) { wipeX = -999; wipeWait = 200 + Math.floor(Math.random() * 160); }
      } else {
        wipeWait--;
        if (wipeWait <= 0) wipeX = -0.2;
      }

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];

        // 刃を通過した水滴は消える
        if (wiping) {
          var bx = bladeAt(d.y);
          if (d.x < bx) {
            d.a -= 0.16;
            if (d.a <= 0) { d.a = 0; d.r = 0.2; }
          }
        }
        // 消えたあと、また結びはじめる
        if (d.a < 1) {
          if (d.a <= 0) {
            d.a = 0.001;
            d.r = 0.2;
            d.r0 = 0.8 + Math.pow(Math.random(), 3.1) * 9.5;
            d.x = Math.random() * W;
            d.y = Math.random() * H;
          }
          d.a = Math.min(1, d.a + 0.0075);
          d.r = Math.min(d.r0, d.r + d.r0 * 0.012);
        } else if (d.r < d.r0 * 1.35) {
          d.r += d.grow * 0.06;   // ゆっくり育つ
        }

        // 大粒だけ、たまに流れ落ちる
        if (d.r > 7.5) {
          d.vy += 0.0045;
          d.y += d.vy;
          d.wob += 0.04;
          d.x += Math.sin(d.wob) * 0.09;
          if (d.y - d.r > H + 16) {
            d.y = -10; d.vy = 0;
            d.x = Math.random() * W;
            d.r0 = 0.8 + Math.pow(Math.random(), 3.1) * 6;
            d.r = d.r0;
          }
        }
        drawDrop(d);
      }

      // --- スキージーの刃（通ったところがきらりと光る） ---
      if (wiping) {
        var x0 = bladeAt(0), x1 = bladeAt(H);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0 - 46, 0);
        ctx.lineTo(x0 + 12, 0);
        ctx.lineTo(x1 + 12, H);
        ctx.lineTo(x1 - 46, H);
        ctx.closePath();
        var lg = ctx.createLinearGradient(x0 - 46, 0, x0 + 12, 0);
        lg.addColorStop(0, 'rgba(255,255,255,0)');
        lg.addColorStop(0.62, 'rgba(255,255,255,0.30)');
        lg.addColorStop(0.94, 'rgba(255,255,255,0.62)');
        lg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = lg;
        ctx.fill();
        ctx.restore();

        // 刃の芯（金の細線）
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x1, H);
        ctx.strokeStyle = 'rgba(179,148,95,0.30)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    // カーソルの通ったところも、水が弾ける
    var host = cv.parentElement;
    if (host && window.matchMedia('(hover:hover)').matches) {
      host.addEventListener('mousemove', function (e) {
        if (Math.random() > 0.1) return;
        var b = cv.getBoundingClientRect();
        var mx = e.clientX - b.left, my = e.clientY - b.top;
        for (var i = 0; i < drops.length; i++) {
          var d = drops[i];
          var dx = d.x - mx, dy = d.y - my;
          if (dx * dx + dy * dy < 2600 && d.a > 0.5) { d.a = 0.35; }
        }
      }, { passive: true });
    }

    var ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    frame();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        frame();
      }
    });
  }

  /* ---------- 料金表：狭い画面ではカード表示にするためのラベル付与 ---------- */
  document.querySelectorAll('.ptable').forEach(function (t) {
    var heads = Array.prototype.map.call(t.querySelectorAll('thead th'), function (th) {
      var c = th.cloneNode(true);
      var s = c.querySelector('small');
      if (s) s.remove();
      return c.textContent.trim();
    });
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      Array.prototype.forEach.call(tr.querySelectorAll('td'), function (td, i) {
        if (heads[i + 1]) td.setAttribute('data-c', heads[i + 1]);
      });
    });
  });

  /* ---------- Marquee: 同じ内容を複製して無限ループ ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (t) {
    if (t.dataset.cloned) return;
    t.dataset.cloned = '1';
    t.innerHTML += t.innerHTML;
  });

  /* ---------- Count-up ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      cio.unobserve(el);
      var to = parseFloat(el.dataset.count);
      var dur = 1300, t0 = null;
      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var v = to * (1 - Math.pow(1 - p, 3));
        el.textContent = (to % 1 === 0) ? Math.round(v).toLocaleString() : v.toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- 現在のページをナビでハイライト ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
})();
