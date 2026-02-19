/**
 * GitQuest — ui.js
 * UI rendering, typewriter effect, theme switching, particles
 */

import { STYLE_CONFIGS } from './music-engine.js';

// ─── Theme Management ──────────────────────────────────────────────────────

export function applyTheme(style) {
  document.body.className = `theme-${style}`;
  document.body.dataset.style = style;

  // Update loading screen icons/text
  const config = STYLE_CONFIGS[style];
  if (config) {
    const icon = document.getElementById('loading-icon');
    const title = document.getElementById('loading-title');
    if (icon) icon.textContent = config.loadingIcon;
    if (title) title.textContent = config.loadingTitle;
  }
}

// ─── Screen Navigation ─────────────────────────────────────────────────────

export function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    if (s.id === screenId) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
}

// ─── Typewriter Effect ─────────────────────────────────────────────────────

let typewriterTimer = null;

export function typewriterText(element, text, speed = 18, onDone = null) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  element.textContent = '';

  // Parse text into paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  let paraIdx = 0;
  let charIdx = 0;
  let currentPara = null;

  function nextChar() {
    if (paraIdx >= paragraphs.length) {
      clearInterval(typewriterTimer);
      if (onDone) onDone();
      return;
    }

    if (!currentPara || charIdx === 0) {
      currentPara = document.createElement('p');
      element.appendChild(currentPara);
    }

    const para = paragraphs[paraIdx];
    if (charIdx < para.length) {
      currentPara.textContent += para[charIdx];
      charIdx++;
    } else {
      paraIdx++;
      charIdx = 0;
      currentPara = null;
    }

    // Auto-scroll
    element.parentElement?.scrollTo({ top: element.parentElement.scrollHeight, behavior: 'smooth' });
  }

  typewriterTimer = setInterval(nextChar, speed);
}

export function skipTypewriter(element, text) {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
  element.innerHTML = '';
  text.split(/\n\n+/).filter(p => p.trim()).forEach(para => {
    const p = document.createElement('p');
    p.textContent = para;
    element.appendChild(p);
  });
}

// ─── Choice Buttons ────────────────────────────────────────────────────────

export function renderChoices(container, choices, onChoice) {
  container.innerHTML = '';
  
  // Render the 3 AI choices
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    // Display 1, 2, 3...
    btn.innerHTML = `<span class="choice-num">${i + 1}.</span><span class="choice-text">${choice.text}</span>`;
    
    btn.addEventListener('click', () => {
      disableAllChoices(container);
      btn.style.opacity = '1';
      btn.style.borderColor = 'var(--color-accent)';
      onChoice(i); // Pass index
    });
    
    // Keyboard shortcut: 1, 2, 3 or A, B, C mapped to position
    btn.dataset.key = (i + 1).toString(); 
    container.appendChild(btn);
  });

  // Render 4th Custom Choice Input
  const customContainer = document.createElement('div');
  customContainer.className = 'choice-custom-container';
  customContainer.innerHTML = `
    <div class="choice-input-wrapper">
      <span class="choice-num">4.</span>
      <input type="text" id="custom-choice-input" placeholder="Type your own action..." maxlength="80">
      <button id="custom-choice-submit" disabled>></button>
    </div>
  `;
  container.appendChild(customContainer);

  const input = customContainer.querySelector('#custom-choice-input');
  const submit = customContainer.querySelector('#custom-choice-submit');

  input.addEventListener('input', () => {
    submit.disabled = !input.value.trim();
  });

  const submitCustomHandler = () => {
    const text = input.value.trim();
    if (!text) return;
    disableAllChoices(container);
    // Visual feedback
    customContainer.classList.add('selected');
    onChoice(text); // Pass string
  };

  submit.addEventListener('click', submitCustomHandler);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitCustomHandler();
  });
}

function disableAllChoices(container) {
  container.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    b.style.opacity = '0.5';
  });
  const input = container.querySelector('#custom-choice-input');
  const submit = container.querySelector('#custom-choice-submit');
  if (input) input.disabled = true;
  if (submit) submit.disabled = true;
}

// ─── Stats Update ──────────────────────────────────────────────────────────

export function updateStats({ hp, maxHp, xp, level, inventory }) {
  const hpFill = document.getElementById('hp-fill');
  const xpFill = document.getElementById('xp-fill');
  const hpVal = document.getElementById('hp-val');
  const xpVal = document.getElementById('xp-val');

  if (hpFill) hpFill.style.width = `${(hp / maxHp) * 100}%`;
  if (xpFill) xpFill.style.width = `${Math.min(100, (xp / 1000) * 100)}%`;
  if (hpVal) hpVal.textContent = hp;
  if (xpVal) xpVal.textContent = xp;

  // Update inventory
  const invList = document.getElementById('inventory-list');
  if (invList) {
    if (inventory.length === 0) {
      invList.innerHTML = '<span class="empty-inventory">Empty</span>';
    } else {
      invList.innerHTML = inventory.map(item =>
        `<span class="inventory-item" title="${item}">${item}</span>`
      ).join('');
    }
  }
}

// ─── Quest Log ─────────────────────────────────────────────────────────────

export function updateQuestLog(quests) {
  const log = document.getElementById('quest-log');
  if (!log) return;
  log.innerHTML = quests.slice(0, 5).map(q =>
    `<div class="quest-entry">Ch.${q.chapter}: ${q.text}</div>`
  ).join('');
}

// ─── Commit Lore ───────────────────────────────────────────────────────────

export function updateCommitLore(commit) {
  const lore = document.getElementById('commit-lore');
  if (!lore || !commit) return;
  lore.innerHTML = `
    <div class="commit-lore-hash">${commit.shortSha}</div>
    <div class="commit-lore-msg">"${commit.subject.slice(0, 60)}${commit.subject.length > 60 ? '...' : ''}"</div>
    <div class="commit-lore-author">by ${commit.author.name}</div>
  `;
}

// ─── Loading Progress ──────────────────────────────────────────────────────

export function setLoadingProgress(pct, message) {
  const bar = document.getElementById('loading-bar');
  const fact = document.getElementById('loading-fact');
  if (bar) bar.style.width = `${Math.min(100, pct)}%`;
  if (fact && message) fact.textContent = message;
}

// ─── Particles ─────────────────────────────────────────────────────────────

export function initParticles(count = 30) {
  const container = document.getElementById('particles');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ─── Popular Repos Grid ────────────────────────────────────────────────────

export function renderRepoGrid(repos, onSelect) {
  const grid = document.getElementById('repos-grid');
  if (!grid) return;

  grid.innerHTML = repos.map(r => `
    <div class="repo-card" data-owner="${r.owner}" data-repo="${r.repo}" tabindex="0" role="button">
      <div class="repo-card-owner">${r.owner}</div>
      <div class="repo-card-name">${r.repo}</div>
      <div class="repo-card-desc">${r.desc}</div>
      <div class="repo-card-stats">
        <span>⭐ ${r.stars}</span>
        <span>📝 ${r.lang}</span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.repo-card').forEach(card => {
    const handler = () => onSelect(card.dataset.owner, card.dataset.repo);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });
}

// ─── Save Slots ────────────────────────────────────────────────────────────

export function renderSaveSlots(saves, onLoad, onDelete) {
  const container = document.getElementById('save-slots');
  if (!container) return;

  if (saves.length === 0) {
    container.innerHTML = '<p style="color:var(--color-text-dim);font-size:0.82rem;text-align:center">No saved quests</p>';
    return;
  }

  container.innerHTML = saves.map(s => `
    <div class="save-slot" data-slot="${s.slot}">
      <div>
        <div class="save-slot-name">${s.repo?.owner}/${s.repo?.repo}</div>
        <div style="font-size:0.72rem;color:var(--color-text-dim)">${s.style} · Ch.${s.chapter} · ${new Date(s.savedAt).toLocaleDateString()}</div>
      </div>
      <button class="btn btn-ghost" style="font-size:0.75rem;padding:4px 8px" data-slot="${s.slot}" data-action="load">Load</button>
    </div>
  `).join('');

  container.querySelectorAll('[data-action="load"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      onLoad(btn.dataset.slot);
    });
  });
}

// ─── Error Display ─────────────────────────────────────────────────────────

export function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

export function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.classList.add('hidden');
}

// ─── Rate Limit UI ─────────────────────────────────────────────────────────

export function updateRateLimitUI(status) {
  const statusEl = document.getElementById('ratelimit-status');
  const valEl = document.getElementById('ratelimit-val');
  const totalEl = document.getElementById('ratelimit-total');
  const resetEl = document.getElementById('ratelimit-reset');

  if (!statusEl || status.remaining === null) return;

  statusEl.classList.remove('hidden');
  valEl.textContent = status.remaining;
  totalEl.textContent = status.remaining > 60 ? '5000' : '60'; // Heuristic
  
  if (status.reset) {
    const resetDate = new Date(status.reset * 1000);
    resetEl.textContent = `Resets at ${resetDate.toLocaleTimeString()}`;
  }
}

let warningEl = null;

export function showRateLimitWarning(remaining) {
  if (remaining > 1) {
    if (warningEl) {
      warningEl.remove();
      warningEl = null;
    }
    return;
  }

  if (warningEl) return; // Already showing

  warningEl = document.createElement('div');
  warningEl.className = 'rate-limit-warning-toast';
  warningEl.innerHTML = `
    <div class="warning-content">
      <span class="warning-icon">⚠️</span>
      <div class="warning-text">
        <strong>GitHub Rate Limit Low</strong>
        <p>1 request remaining. Add a PAT in settings to continue playing without interruption.</p>
      </div>
      <button class="warning-close">✕</button>
    </div>
  `;

  document.body.appendChild(warningEl);

  warningEl.querySelector('.warning-close').addEventListener('click', () => {
    warningEl.remove();
    warningEl = null;
  });
}

// ─── Keyboard shortcuts ────────────────────────────────────────────────────

export function initKeyboardShortcuts(onChoice) {
  document.addEventListener('keydown', e => {
    // 1, 2, 3 keys
    if (['1', '2', '3'].includes(e.key)) {
      const btn = document.querySelector(`.choice-btn[data-key="${e.key}"]`);
      if (btn && !btn.disabled) btn.click();
    }
    // Focus input on 4
    if (e.key === '4') {
      const input = document.getElementById('custom-choice-input');
      if (input && !input.disabled) input.focus();
    }
    // Space/Enter to skip typewriter
    if (e.key === ' ' || e.key === 'Enter') {
      const storyText = document.getElementById('story-text');
      if (storyText && typewriterTimer) {
        e.preventDefault();
        // Will be handled by app.js
        document.dispatchEvent(new CustomEvent('skipTypewriter'));
      }
    }
  });
}
