/* ── app.js ──────────────────────────────────────────────────────── */

'use strict';

// ─── Typewriter sequence ─────────────────────────────────────────────────────

const TYPEWRITER_SEQUENCE = [
  { type: 'cmd',    text: 'whoami' },
  { type: 'output', lines: [
    '<span class="t-key">name</span>     <span class="t-comment">→</span> <span class="t-val">[Your Name]</span>',
    '<span class="t-key">role</span>     <span class="t-comment">→</span> <span class="t-val">Data &amp; ML Engineer</span>',
    '<span class="t-key">location</span> <span class="t-comment">→</span> <span class="t-val">Remote / Worldwide</span>',
  ]},
  { type: 'blank' },
  { type: 'cmd',    text: 'cat mission.txt' },
  { type: 'output', lines: [
    '<span class="t-comment">// Building intelligent data systems that turn raw bytes</span>',
    '<span class="t-comment">// into competitive advantage — at any scale, any speed.</span>',
  ]},
  { type: 'blank' },
  { type: 'cmd',    text: 'ls top-skills/' },
  { type: 'output', lines: [
    '<span class="t-val">Python</span>  <span class="t-val">SQL</span>  <span class="t-val">Spark</span>  <span class="t-val">Airflow</span>  <span class="t-val">PyTorch</span>  <span class="t-val">Kubernetes</span>',
  ]},
  { type: 'blank' },
  { type: 'idle' },
];

function initTypewriter() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  let seqIdx = 0;
  let charIdx = 0;

  function writePrompt() {
    const promptEl = document.createElement('span');
    promptEl.className = 't-line';
    promptEl.innerHTML = '<span class="t-prompt">visitor@portfolio:~$</span> ';
    body.appendChild(promptEl);
    return promptEl;
  }

  function addOutput(lines) {
    lines.forEach(html => {
      const el = document.createElement('span');
      el.className = 't-line t-output';
      el.innerHTML = html;
      body.appendChild(el);
    });
  }

  function addBlank() {
    const el = document.createElement('span');
    el.className = 't-blank';
    body.appendChild(el);
  }

  function addCursor() {
    const el = document.createElement('span');
    el.className = 't-cursor';
    el.id = 'termCursor';
    return el;
  }

  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function nextStep() {
    if (seqIdx >= TYPEWRITER_SEQUENCE.length) return;
    const step = TYPEWRITER_SEQUENCE[seqIdx];

    if (step.type === 'blank') {
      addBlank();
      seqIdx++;
      setTimeout(nextStep, 60);
      return;
    }

    if (step.type === 'output') {
      addOutput(step.lines);
      seqIdx++;
      setTimeout(nextStep, 180);
      scrollBottom();
      return;
    }

    if (step.type === 'idle') {
      // Show idle prompt with blinking cursor
      const promptEl = writePrompt();
      promptEl.appendChild(addCursor());
      scrollBottom();
      return;
    }

    if (step.type === 'cmd') {
      const promptEl = writePrompt();
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 't-cmd';
      promptEl.appendChild(cmdSpan);

      // Append cursor after cmd span
      const cursor = addCursor();
      promptEl.appendChild(cursor);

      const text = step.text;
      charIdx = 0;

      function typeChar() {
        if (charIdx < text.length) {
          cmdSpan.textContent += text[charIdx++];
          scrollBottom();
          setTimeout(typeChar, 45 + Math.random() * 30);
        } else {
          cursor.remove();
          seqIdx++;
          setTimeout(nextStep, 350);
        }
      }
      setTimeout(typeChar, 200);
    }
  }

  setTimeout(nextStep, 600);
}

// ─── Counter animation ───────────────────────────────────────────────────────

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ─── Skill bars ──────────────────────────────────────────────────────────────

function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const pct = el.dataset.pct;
      el.style.width = pct + '%';
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

// ─── Scroll fade-in animations ───────────────────────────────────────────────

function initScrollAnimations() {
  const targets = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

  targets.forEach(el => observer.observe(el));
}

// ─── Mobile nav toggle ───────────────────────────────────────────────────────

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ─── Misc utilities ──────────────────────────────────────────────────────────

function initMisc() {
  // Footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Last updated
  const lu = document.getElementById('lastUpdated');
  if (lu) {
    const d = new Date();
    lu.textContent = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}

// ─── Live GitHub data ────────────────────────────────────────────────────────

function timeAgo(isoDate) {
  const days = Math.floor((Date.now() - new Date(isoDate)) / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const GITHUB_USER = 'MosesItapara';
const ONGOING_EXCLUDED = ['Portfolio-Design', 'MosesItapara', 'appgithubaction'];

// All repos that have a curated card on either index.html or projects.html
const ALL_FEATURED_REPOS = new Set([
  'Churn-Prediction',
  'Log-Text-Classification-Regex-Statistical-ML-LLM',
  'Text-Summarizer-HuggingFace',
  'Calories-Burnt-Prediction',
  'Network-Security',
  'Data-Science-Project',
  'Music-Recommendation-System',
  'Movie-Recommendation-System',
  'Globe-Travel-Assistant-AI-Agent',
  'Forecasting-Rental-Bike-Count-Kedro-Dash-Docker-Railway',
  'Predicting-Maternal-Health-Risk-Kedro-Flask-Docker-Railway',
  'Atlas-Travel-Assistant-Chatbot',
  'Nairobi-House-Price-Prediction-Streamlit',
  'VitrAI-Glass-Type-Classification-System-Flask',
  'POTATO-DESEASE-CLASSIFICATION-DEEP-LEARNING',
]);

function renderOngoingProjects(repos) {
  const grid = document.getElementById('ongoingGrid');
  if (!grid) return;

  const ongoing = Object.entries(repos)
    .filter(([name]) => !ALL_FEATURED_REPOS.has(name) && !ONGOING_EXCLUDED.includes(name))
    .sort((a, b) => new Date(b[1].updatedAt) - new Date(a[1].updatedAt));

  if (!ongoing.length) {
    grid.innerHTML = '<p style="font-size:0.78rem;color:var(--text-dimmer);">Nothing outside the featured projects right now.</p>';
    return;
  }

  grid.innerHTML = ongoing.map(([name, repo]) => `
    <article class="project-card">
      <div class="project-top">
        <span class="project-status status-progress">IN PROGRESS ◌</span>
        <a href="${repo.htmlUrl || `https://github.com/${GITHUB_USER}/${name}`}" target="_blank" class="project-link">View on GitHub ↗</a>
      </div>
      <h3 class="project-name">${name.replace(/-/g, ' ')}</h3>
      <span class="project-live">★ ${repo.stars} · updated ${timeAgo(repo.updatedAt)}</span>
      <p class="project-desc">${repo.description || 'No description yet.'}</p>
      <div class="project-tags">${repo.language ? `<span class="tag">${repo.language}</span>` : ''}</div>
    </article>
  `).join('');
}

async function initGithubData() {
  const repoEl  = document.getElementById('gh-repos');
  const langsEl = document.getElementById('gh-langs');

  try {
    const res = await fetch('/api/github-data');
    if (!res.ok) return;
    const data = await res.json();

    if (repoEl && data.repoCount) repoEl.textContent = data.repoCount + '+';
    if (langsEl && data.topLanguages?.length) langsEl.innerHTML = data.topLanguages.join('<br>');

    const featuredNames = new Set();
    document.querySelectorAll('[data-repo]').forEach(card => {
      featuredNames.add(card.dataset.repo);
      const repo = data.repos?.[card.dataset.repo];
      const liveEl = card.querySelector('.project-live');
      if (repo && liveEl) {
        liveEl.textContent = `★ ${repo.stars} · updated ${timeAgo(repo.updatedAt)}`;
      }
    });

    if (data.repos) renderOngoingProjects(data.repos);
  } catch {
    // Live stats are a nice-to-have; silently keep the static fallback values.
  }
}

// ─── Boot ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initCounters();
  initSkillBars();
  initScrollAnimations();
  initMobileNav();
  initMisc();
  initGithubData();
});
