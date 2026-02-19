/**
 * GitQuest — app.js
 * Main application controller
 * URL routing: gitquest.com/owner/repo → auto-loads that repo
 */

import { storage } from './storage.js';
import { parseRepoInput, fetchRepoInfo, fetchCommits, analyzeCommits, POPULAR_REPOS } from './github.js';
import { aiEngine } from './ai-engine.js';
import { musicEngine, STYLE_CONFIGS } from './music-engine.js';
import { storyEngine } from './story-engine.js';
import {
  applyTheme, showScreen, typewriterText, skipTypewriter,
  renderChoices, updateStats, updateQuestLog, updateCommitLore,
  setLoadingProgress, initParticles, renderRepoGrid, renderSaveSlots,
  showError, hideError, initKeyboardShortcuts,
  updateRateLimitUI, showRateLimitWarning
} from './ui.js';
import { getRateLimitStatus } from './github.js';

// ─── App State ─────────────────────────────────────────────────────────────

const app = {
  currentRepo: null,   // { owner, repo }
  currentStyle: 'dnd',
  commits: [],
  analysis: null,
  currentNarrative: '',
  musicStarted: false,
};

// ─── Init ──────────────────────────────────────────────────────────────────

async function init() {
  // Apply saved theme or default
  const savedStyle = storage.getSetting('lastStyle', 'dnd');
  applyTheme(savedStyle);
  app.currentStyle = savedStyle;

  // Init particles on landing
  initParticles(35);

  // Render popular repos
  renderRepoGrid(POPULAR_REPOS, (owner, repo) => {
    document.getElementById('repo-url-input').value = `${owner}/${repo}`;
    startWithRepo(`${owner}/${repo}`);
  });

  // Wire up landing UI
  document.getElementById('begin-quest-btn').addEventListener('click', () => {
    const val = document.getElementById('repo-url-input').value.trim();
    if (val) startWithRepo(val);
    else showError('url-error', 'Please enter a repository (e.g. facebook/react)');
  });

  document.getElementById('repo-url-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('begin-quest-btn').click();
  });

  // Style selector
  document.querySelectorAll('.style-card').forEach(card => {
    card.addEventListener('click', () => selectStyle(card.dataset.style));
    card.querySelector('.btn-style-select')?.addEventListener('click', e => {
      e.stopPropagation();
      selectStyle(card.dataset.style);
    });
  });

  // Style screen back
  document.getElementById('style-back-btn').addEventListener('click', () => showScreen('screen-landing'));

  // Settings modal
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('settings-modal').querySelector('.modal-backdrop').addEventListener('click', closeSettings);
  document.getElementById('settings-save').addEventListener('click', saveSettings);

  // AI mode toggle
  document.querySelectorAll('input[name="ai-mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isApi = radio.value === 'api';
      document.getElementById('api-section').classList.toggle('hidden', !isApi);
      document.getElementById('local-model-section').classList.toggle('hidden', isApi);
    });
  });

  // Game controls
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);
  document.getElementById('music-volume').addEventListener('input', e => {
    musicEngine.setVolume(e.target.value / 100);
  });
  document.getElementById('game-menu-btn').addEventListener('click', openGameMenu);
  document.getElementById('game-menu-close').addEventListener('click', closeGameMenu);
  document.getElementById('game-menu').querySelector('.modal-backdrop').addEventListener('click', closeGameMenu);
  document.getElementById('save-game-btn').addEventListener('click', () => {
    storyEngine.saveGame(`slot_${Date.now()}`);
    closeGameMenu();
  });
  document.getElementById('load-game-btn').addEventListener('click', showLoadMenu);
  document.getElementById('restart-btn').addEventListener('click', () => {
    closeGameMenu();
    showScreen('screen-style');
  });
  document.getElementById('change-style-btn').addEventListener('click', () => {
    closeGameMenu();
    showScreen('screen-style');
  });
  document.getElementById('new-repo-btn').addEventListener('click', () => {
    closeGameMenu();
    showScreen('screen-landing');
  });

  // Keyboard shortcuts
  initKeyboardShortcuts();
  document.addEventListener('skipTypewriter', () => {
    const el = document.getElementById('story-text');
    if (el) skipTypewriter(el, app.currentNarrative);
  });

  // Story engine callbacks
  storyEngine.onSceneReady = onSceneReady;
  storyEngine.onStatsUpdate = updateStats;
  storyEngine.onQuestUpdate = updateQuestLog;

  // Load settings into UI
  loadSettingsIntoUI();

  // Rate limit listener
  window.addEventListener('github-ratelimit-update', (e) => {
    updateRateLimitUI(e.detail);
    showRateLimitWarning(e.detail.remaining);
  });

  // ─── URL-based routing ──────────────────────────────────────────────────
  handleURLRouting();
}

// ─── URL Routing ───────────────────────────────────────────────────────────

function handleURLRouting() {
  // Parse path: /owner/repo or /owner/repo/style
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);

  if (parts.length >= 2) {
    const owner = parts[0];
    const repo = parts[1];
    const style = parts[2] || null;

    // Pre-fill the input
    document.getElementById('repo-url-input').value = `${owner}/${repo}`;

    // Auto-start
    if (style && ['dnd', 'scifi', 'horror'].includes(style)) {
      app.currentStyle = style;
      applyTheme(style);
      startWithRepo(`${owner}/${repo}`, style);
    } else {
      startWithRepo(`${owner}/${repo}`);
    }
  } else {
    // No repo in URL — show landing
    showScreen('screen-landing');
  }

  // Handle browser back/forward
  window.addEventListener('popstate', handleURLRouting);
}

function pushURL(owner, repo, style = null) {
  const path = style ? `/${owner}/${repo}/${style}` : `/${owner}/${repo}`;
  window.history.pushState({ owner, repo, style }, '', path);
}

// ─── Repo Selection ────────────────────────────────────────────────────────

async function startWithRepo(input, autoStyle = null) {
  hideError('url-error');

  const parsed = parseRepoInput(input);
  if (!parsed) {
    showError('url-error', 'Invalid repository format. Use "owner/repo" or a GitHub URL.');
    showScreen('screen-landing');
    return;
  }

  app.currentRepo = parsed;
  pushURL(parsed.owner, parsed.repo);

  // Update style screen badge
  document.getElementById('style-repo-badge').textContent = `${parsed.owner}/${parsed.repo}`;

  if (autoStyle) {
    // Skip style selection, go straight to loading
    await beginAdventure(autoStyle);
  } else {
    showScreen('screen-style');
  }
}

// ─── Style Selection ───────────────────────────────────────────────────────

async function selectStyle(style) {
  app.currentStyle = style;
  applyTheme(style);
  storage.saveSettings({ lastStyle: style });
  pushURL(app.currentRepo.owner, app.currentRepo.repo, style);
  await beginAdventure(style);
}

// ─── Adventure Start ───────────────────────────────────────────────────────

async function beginAdventure(style) {
  showScreen('screen-loading');
  applyTheme(style);

  const { owner, repo } = app.currentRepo;
  const token = storage.getSetting('githubToken');

  const loadingFacts = {
    dnd: [
      'Consulting the ancient commit scrolls...',
      'Awakening the code spirits...',
      'Mapping the dungeon of dependencies...',
      'Forging your destiny from git history...',
    ],
    scifi: [
      'Scanning repository data streams...',
      'Calibrating narrative algorithms...',
      'Initializing crew manifest from contributors...',
      'Plotting course through commit space...',
    ],
    horror: [
      'Something stirs in the repository...',
      'Reading the cursed commit log...',
      'The contributors left messages. Read them if you dare...',
      'Darkness gathers around the merge conflicts...',
    ],
  };

  const facts = loadingFacts[style] || loadingFacts.dnd;
  let factIdx = 0;
  const factInterval = setInterval(() => {
    setLoadingProgress(null, facts[factIdx % facts.length]);
    factIdx++;
  }, 2500);

  try {
    // Step 1: Fetch repo info
    setLoadingProgress(10, facts[0]);
    await fetchRepoInfo(owner, repo, token);

    // Step 2: Fetch commits
    setLoadingProgress(30, facts[1]);
    const commits = await fetchCommits(owner, repo, token, 80);

    if (commits.length === 0) {
      throw new Error('This repository has no commits yet.');
    }

    app.commits = commits;

    // Step 3: Analyze
    setLoadingProgress(60, facts[2]);
    app.analysis = analyzeCommits(commits);

    // Step 4: Init music
    setLoadingProgress(75, 'Composing the soundtrack...');
    try {
      await musicEngine.init(style, app.analysis);
    } catch (e) {
      console.warn('Music init failed:', e);
    }

    // Step 5: Start story
    setLoadingProgress(90, facts[3]);
    await storyEngine.startGame(app.currentRepo, style, commits, app.analysis);

    setLoadingProgress(100, 'Your quest begins...');
    clearInterval(factInterval);

    // Small delay for dramatic effect
    await sleep(600);

    // Setup game screen
    setupGameScreen();
    showScreen('screen-game');

    // Start music (requires user gesture — already happened via click)
    try {
      await musicEngine.play();
      app.musicStarted = true;
      updateMusicButton(true);
    } catch (e) {
      console.warn('Music autoplay blocked:', e);
    }

    // Add to history
    storage.addToHistory({ owner, repo, style, commits: commits.length });

  } catch (err) {
    clearInterval(factInterval);
    console.error('Adventure start failed:', err);
    showError('url-error', err.message || 'Failed to load repository. Please try again.');
    showScreen('screen-landing');
  }
}

// ─── Game Screen Setup ─────────────────────────────────────────────────────

function setupGameScreen() {
  const { owner, repo } = app.currentRepo;
  const style = app.currentStyle;

  document.getElementById('game-repo-name').textContent = `${owner}/${repo}`;
  document.getElementById('game-style-badge').textContent = { dnd: '⚔ D&D', scifi: '🚀 Sci-Fi', horror: '💀 Horror' }[style] || style;

  // Hero name from top contributor
  const topAuthor = app.analysis?.authors?.[0] || 'Adventurer';
  document.getElementById('hero-name').textContent = topAuthor.split(' ')[0];

  // Hero avatar based on style
  const avatars = { dnd: '🧙', scifi: '👨‍🚀', horror: '🕵️' };
  document.getElementById('hero-avatar').textContent = avatars[style] || '🧙';

  // Initial stats
  updateStats({ hp: 100, maxHp: 100, xp: 0, level: 1, inventory: [] });
}

// ─── Scene Rendering ───────────────────────────────────────────────────────

function onSceneReady(scene, commit) {
  const storyText = document.getElementById('story-text');
  const choicesPanel = document.getElementById('choices-panel');
  const sceneLocation = document.getElementById('scene-location');
  const generatingIndicator = document.getElementById('generating-indicator');
  const chapterNum = document.getElementById('chapter-num');

  // Hide generating indicator
  generatingIndicator.classList.add('hidden');

  // Update chapter
  if (storyEngine.state) {
    chapterNum.textContent = storyEngine.state.chapter;
  }

  // Scene location
  if (commit) {
    const progress = storyEngine.getProgress();
    const locationNames = {
      dnd: ['The Entrance Hall', 'The Dark Forest', 'The Ancient Library', 'The Dragon\'s Lair', 'The Final Chamber'],
      scifi: ['Docking Bay', 'Engine Room', 'Command Bridge', 'Deep Space', 'The Anomaly'],
      horror: ['The Front Door', 'The Basement', 'The Attic', 'The Hidden Room', 'The Abyss'],
    };
    const locations = locationNames[app.currentStyle] || locationNames.dnd;
    const locIdx = Math.floor(progress * (locations.length - 1));
    sceneLocation.textContent = locations[locIdx];

    // Update commit lore
    updateCommitLore(commit);
  } else {
    sceneLocation.textContent = scene.isEpilogue ? '✦ Epilogue ✦' : '';
  }

  // Typewriter narrative
  app.currentNarrative = scene.narrative;
  typewriterText(storyText, scene.narrative, 20, () => {
    // Show choices after text is done
    renderChoices(choicesPanel, scene.choices, onChoiceMade);
  });

  // Also show choices immediately (can click while reading)
  setTimeout(() => {
    if (choicesPanel.children.length === 0) {
      renderChoices(choicesPanel, scene.choices, onChoiceMade);
    }
  }, 500);

  // Scroll to top of story
  document.querySelector('.story-scene')?.scrollTo({ top: 0, behavior: 'smooth' });
}

async function onChoiceMade(choiceIndex, choice) {
  const generatingIndicator = document.getElementById('generating-indicator');
  const choicesPanel = document.getElementById('choices-panel');

  // Show generating indicator
  generatingIndicator.classList.remove('hidden');
  choicesPanel.innerHTML = '';

  // Handle epilogue choices
  if (storyEngine.state?.currentScene?.isEpilogue) {
    if (choiceIndex === 0) {
      showScreen('screen-landing');
    } else if (choiceIndex === 1) {
      showScreen('screen-style');
    } else {
      await storyEngine.startGame(app.currentRepo, app.currentStyle, app.commits, app.analysis);
    }
    return;
  }

  await storyEngine.makeChoice(choiceIndex);
}

// ─── Music Controls ────────────────────────────────────────────────────────

async function toggleMusic() {
  if (!app.musicStarted) {
    try {
      await musicEngine.play();
      app.musicStarted = true;
    } catch (e) { console.warn(e); }
  } else {
    musicEngine.toggle();
  }
  updateMusicButton(musicEngine.isPlaying);
}

function updateMusicButton(isPlaying) {
  const btn = document.getElementById('music-toggle');
  if (btn) btn.textContent = isPlaying ? '🎵' : '🔇';
  btn?.setAttribute('title', isPlaying ? 'Mute Music' : 'Play Music');
}

// ─── Settings ──────────────────────────────────────────────────────────────

function openSettings() {
  const status = getRateLimitStatus();
  updateRateLimitUI(status);
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function saveSettings() {
  const aiMode = document.querySelector('input[name="ai-mode"]:checked')?.value || 'local';
  const localModel = document.getElementById('local-model-select').value;
  const apiBaseUrl = document.getElementById('api-base-url').value.trim();
  const apiKey = document.getElementById('api-key-input').value.trim();
  const apiModel = document.getElementById('api-model-input').value.trim();
  const githubToken = document.getElementById('github-pat-input').value.trim();

  storage.saveSettings({ aiMode, localModel, apiBaseUrl, apiKey, apiModel, githubToken });
  aiEngine.loadSettings();
  closeSettings();
}

function loadSettingsIntoUI() {
  const s = storage.getSettings();
  if (s.aiMode) {
    const radio = document.querySelector(`input[name="ai-mode"][value="${s.aiMode}"]`);
    if (radio) {
      radio.checked = true;
      document.getElementById('api-section').classList.toggle('hidden', s.aiMode !== 'api');
      document.getElementById('local-model-section').classList.toggle('hidden', s.aiMode === 'api');
    }
  }
  if (s.localModel) document.getElementById('local-model-select').value = s.localModel;
  if (s.apiBaseUrl) document.getElementById('api-base-url').value = s.apiBaseUrl;
  if (s.apiKey) document.getElementById('api-key-input').value = s.apiKey;
  if (s.apiModel) document.getElementById('api-model-input').value = s.apiModel;
  if (s.githubToken) document.getElementById('github-pat-input').value = s.githubToken;
}

// ─── Game Menu ─────────────────────────────────────────────────────────────

function openGameMenu() {
  const saves = storage.listSaves();
  renderSaveSlots(saves, (slot) => {
    try {
      storyEngine.loadGame(slot);
      closeGameMenu();
      setupGameScreen();
      if (storyEngine.state?.currentScene) {
        onSceneReady(storyEngine.state.currentScene, storyEngine.getCurrentCommit());
      }
    } catch (e) {
      console.error('Load failed:', e);
    }
  });
  document.getElementById('game-menu').classList.remove('hidden');
}

function closeGameMenu() {
  document.getElementById('game-menu').classList.add('hidden');
}

function showLoadMenu() {
  // Already rendered in openGameMenu
}

// ─── Utility ──────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Boot ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
