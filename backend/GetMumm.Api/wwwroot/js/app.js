// ── Theme (runs before DOM ready to prevent flash) ──────────────────────
(function () {
  const stored = localStorage.getItem('gm-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide icons ──────────────────────────────────────────────────────
  if (window.lucide) lucide.createIcons();

  // ── Theme toggle ──────────────────────────────────────────────────────
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('gm-theme', isDark ? 'dark' : 'light');
    });
  });

  // ── Mobile nav ────────────────────────────────────────────────────────
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
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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

  // ── Index page: live health status in hero ─────────────────────────────
  const hsStatus = document.getElementById('hs-status');
  if (hsStatus) {
    fetch('/api/health')
      .then(r => { hsStatus.textContent = r.ok ? 'OK' : '!'; })
      .catch(() => { hsStatus.textContent = '!'; });
  }

  // ── Stats page ────────────────────────────────────────────────────────
  if (document.getElementById('result-stats')) {
    initStatsPage(animateNum);
  }

});

// ── Stats page: JSON syntax highlighting ──────────────────────────────────
function syntaxHighlight(json) {
  const str = JSON.stringify(json, null, 2);
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      m => {
        let cls = 'json-num';
        if (/^"/.test(m)) { cls = /:$/.test(m) ? 'json-key' : 'json-str'; }
        else if (/true|false/.test(m)) { cls = 'json-bool'; }
        return `<span class="${cls}">${m}</span>`;
      }
    );
}

// ── Stats page: fetch and render a single endpoint ────────────────────────
async function fetchAndShow(url, elId) {
  const el = document.getElementById(elId);
  if (!el) return null;
  el.className = 'api-result loading';
  el.textContent = 'Loading…';
  try {
    const r = await fetch(url);
    const data = await r.json();
    el.className = 'api-result';
    el.innerHTML = syntaxHighlight(data);
    return data;
  } catch (e) {
    el.className = 'api-result error';
    el.textContent = 'Error: ' + e.message;
    return null;
  }
}

// ── Stats page: initialise all live data ──────────────────────────────────
function initStatsPage(animateNum) {
  async function loadAll() {
    const btn         = document.getElementById('btn-refresh');
    const healthPill  = document.getElementById('hero-health-pill');
    const healthIcon  = document.getElementById('health-icon');
    const healthTitle = document.getElementById('health-title');
    const healthMsg   = document.getElementById('health-msg');

    if (btn) btn.classList.add('spinning');

    // Health check
    try {
      const r  = await fetch('/api/health');
      const h  = await r.json();
      const ok = r.ok && h.status === 'Healthy';

      if (healthPill) {
        healthPill.querySelector('.status-dot').style.background = ok ? '#4ade80' : '#f87171';
        const txt = healthPill.querySelector('.pill-text');
        if (txt) txt.textContent = ok ? 'API Healthy' : 'API Unhealthy';
      }
      if (healthIcon)  healthIcon.dataset.state  = ok ? 'healthy' : 'unhealthy';
      if (healthTitle) healthTitle.textContent   = h.status || (ok ? 'Healthy' : 'Unhealthy');
      if (healthMsg)   healthMsg.textContent     = h.message || '';

      const rh = document.getElementById('result-health');
      if (rh) { rh.className = 'api-result'; rh.innerHTML = syntaxHighlight(h); }
    } catch (e) {
      if (healthIcon)  healthIcon.dataset.state  = 'unhealthy';
      if (healthTitle) healthTitle.textContent   = 'Unreachable';
      if (healthMsg)   healthMsg.textContent     = e.message;
    }

    // Stats counters
    const stats = await fetchAndShow('/api/stats', 'result-stats');
    if (stats) {
      const map = {
        's-chefs':   stats.chefCount        ?? stats.totalChefs,
        's-items':   stats.menuItemCount     ?? stats.totalMenuItems,
        's-posts':   stats.blogPostCount     ?? stats.totalBlogPosts,
        's-reviews': stats.testimonialCount  ?? stats.totalTestimonials,
        's-plans':   stats.subscriptionCount ?? stats.totalSubscriptions,
      };
      for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el && typeof val === 'number') {
          el.dataset.target = val;
          animateNum(el, val);
        }
      }
    }

    // Categories explorer
    await fetchAndShow('/api/menu/categories', 'result-cats');

    // Timestamps
    const now = new Date().toLocaleTimeString();
    const lu  = document.getElementById('last-updated');
    const ri  = document.getElementById('refresh-info');
    if (lu) lu.textContent = 'Last updated: ' + now;
    if (ri) ri.textContent = 'Auto-refreshes every 30 s · Last: ' + now;

    if (btn) btn.classList.remove('spinning');
  }

  // Expose for optional onclick usage
  window.loadAll = loadAll;

  // Initial load + auto-refresh
  loadAll();
  setInterval(loadAll, 30000);

  // Wire refresh button
  document.getElementById('btn-refresh')?.addEventListener('click', loadAll);
}
