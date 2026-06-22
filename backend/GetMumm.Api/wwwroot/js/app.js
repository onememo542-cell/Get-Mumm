// ── Theme ────────────────────────────────────────────────────────────────
(function () {
  const stored = localStorage.getItem('gm-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {
  // ── Theme toggle ─────────────────────────────────────────────────────
  const btns = document.querySelectorAll('.btn-theme');
  const update = () => {
    const isDark = document.documentElement.classList.contains('dark');
    btns.forEach(b => b.textContent = isDark ? '☀️' : '🌙');
  };
  update();
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('gm-theme', isDark ? 'dark' : 'light');
      update();
    });
  });

  // ── Mobile nav ───────────────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // ── Active nav link ───────────────────────────────────────────────────
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href === path || (href === '' && path === '/')) {
      a.classList.add('active');
    }
  });

  // ── Dynamic footer year ───────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Animate numbers on scroll ─────────────────────────────────────────
  const animateNum = (el, target, duration = 1200) => {
    const start = performance.now();
    const from = 0;
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (target - from) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target || '0', 10);
          animateNum(el, target);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-val[data-target]').forEach(el => obs.observe(el));
  }
});
