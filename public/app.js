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

// ─── AI Chat ─────────────────────────────────────────────────────────────────

function initChat() {
  const messagesEl = document.getElementById('chatMessages');
  const inputEl    = document.getElementById('chatInput');
  const sendBtn    = document.getElementById('chatSend');
  if (!messagesEl || !inputEl || !sendBtn) return;

  let history = [];   // [{role, content}]
  let busy = false;

  function scrollToBottom() {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }

  function appendMessage(role, text, className = '') {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role} ${className}`.trim();

    const prompt = document.createElement('span');
    prompt.className = 'msg-prompt';
    prompt.textContent = role === 'user'
      ? 'visitor@portfolio:~$'
      : 'ai@portfolio:~$';

    const msg = document.createElement('span');
    msg.className = 'msg-text';
    msg.textContent = text;

    wrap.appendChild(prompt);
    wrap.appendChild(msg);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return msg;
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text || busy) return;

    busy = true;
    sendBtn.disabled = true;
    inputEl.value = '';

    // User message
    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    // Thinking indicator
    const thinkingEl = appendMessage('assistant', '...thinking...', 'thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();

      if (data.error) {
        thinkingEl.textContent = `[ERROR] ${data.error}`;
        thinkingEl.parentElement.classList.add('error');
      } else {
        const reply = data.reply || '(empty response)';
        thinkingEl.textContent = reply;
        thinkingEl.parentElement.classList.remove('thinking');
        history.push({ role: 'assistant', content: reply });
      }
    } catch (err) {
      thinkingEl.textContent = `[NETWORK ERROR] Could not reach AI service. Check your ANTHROPIC_API_KEY.`;
    }

    busy = false;
    sendBtn.disabled = false;
    inputEl.focus();
    scrollToBottom();
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
}

// ─── Scroll fade-in animations ───────────────────────────────────────────────

function initScrollAnimations() {
  const targets = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
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

// ─── Boot ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initCounters();
  initSkillBars();
  initChat();
  initScrollAnimations();
  initMobileNav();
  initMisc();
});
