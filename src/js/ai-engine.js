/**
 * GitQuest — ai-engine.js
 * AI narrative generation: local WebLLM or API mode
 */

import { storage } from './storage.js';

// ─── Prompt Templates ──────────────────────────────────────────────────────

const SYSTEM_PROMPTS = {
  dnd: `You are the Dungeon Master of GitQuest, a text adventure game where a software repository's commit history has been transformed into a fantasy world.

Rules:
- Commits are "quests" or "events" in the realm
- Bug fixes are battles against monsters or curses
- New features are magical discoveries or artifacts
- Contributors are heroes, wizards, or guild members
- The codebase is a living dungeon, castle, or ancient tome
- Refactors are "great cleansings" or "restructuring of the realm"
- Merge conflicts are "wars between factions"

Write in the style of classic D&D: dramatic, epic, with old-English flavor. Keep responses to 3-5 sentences of vivid narrative, then offer exactly 3 choices. Format choices as:
[A] First choice
[B] Second choice  
[C] Third choice`,

  scifi: `You are the Ship's AI of GitQuest, a text adventure game where a software repository's commit history has been transformed into a science fiction universe.

Rules:
- Commits are "mission logs" or "system updates"
- Bug fixes are "critical system failures" being resolved
- New features are "technological breakthroughs" or "new modules"
- Contributors are "crew members" or "specialist units"
- The codebase is a living starship or space station
- Refactors are "system overhauls" or "core architecture upgrades"
- Merge conflicts are "signal interference" or "faction disputes"

Write in the style of hard sci-fi: technical, terse, with mission-log formatting. Keep responses to 3-5 sentences, then offer exactly 3 choices. Format choices as:
[A] First choice
[B] Second choice
[C] Third choice`,

  horror: `You are the Narrator of GitQuest, a text horror adventure where a software repository's commit history has been transformed into a dark, terrifying world.

Rules:
- Commits are "dark events" or "disturbances in the code"
- Bug fixes are "attempts to contain the horror"
- New features are "dangerous experiments" or "forbidden knowledge"
- Contributors are "survivors" or "those who came before"
- The codebase is a haunted mansion, asylum, or cursed artifact
- Refactors are "desperate attempts to restore order"
- Merge conflicts are "fractures in reality" or "the horror spreading"

Write in the style of psychological horror: dread-filled, atmospheric, with a sense of creeping doom. Keep responses to 3-5 sentences, then offer exactly 3 choices. Format choices as:
[A] First choice
[B] Second choice
[C] Third choice`,
};

const LOADING_MESSAGES = {
  dnd: ['The oracle consults the ancient scrolls...', 'The Dungeon Master weaves your fate...', 'The magic crystals reveal your path...'],
  scifi: ['Processing narrative matrix...', 'AI core generating scenario...', 'Calculating probability vectors...'],
  horror: ['Something stirs in the darkness...', 'The voices whisper your fate...', 'The pages write themselves...'],
};

// ─── Engine Class ──────────────────────────────────────────────────────────

class AIEngine {
  constructor() {
    this.mode = 'local'; // 'local' | 'api'
    this.localEngine = null;
    this.localModelId = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';
    this.apiBaseUrl = 'https://api.openai.com/v1';
    this.apiKey = '';
    this.apiModel = 'gpt-4o-mini';
    this.loadSettings();
  }

  loadSettings() {
    const s = storage.getSettings();
    this.mode = s.aiMode || 'local';
    this.localModelId = s.localModel || 'Phi-3-mini-4k-instruct-q4f16_1-MLC';
    this.apiBaseUrl = s.apiBaseUrl || 'https://api.openai.com/v1';
    this.apiKey = s.apiKey || '';
    this.apiModel = s.apiModel || 'gpt-4o-mini';
  }

  getLoadingMessage(style) {
    const msgs = LOADING_MESSAGES[style] || LOADING_MESSAGES.dnd;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  /**
   * Generate a story scene from commit data + game state
   */
  async generateScene({ commits, currentCommitIndex, style, gameState, playerChoice = null }) {
    const commit = commits[currentCommitIndex] || commits[0];
    const prevCommit = commits[currentCommitIndex - 1] || null;

    const userPrompt = buildUserPrompt({ commit, prevCommit, style, gameState, playerChoice, currentCommitIndex, total: commits.length });

    const systemPrompt = SYSTEM_PROMPTS[style] || SYSTEM_PROMPTS.dnd;

    if (this.mode === 'api' && this.apiKey) {
      return this.generateViaAPI(systemPrompt, userPrompt);
    } else {
      return this.generateViaLocal(systemPrompt, userPrompt);
    }
  }

  // ─── Local WebLLM ───────────────────────────────────────────────────────

  async initLocalEngine(onProgress) {
    if (this.localEngine) return this.localEngine;

    // Dynamically import WebLLM
    const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');

    this.localEngine = await CreateMLCEngine(this.localModelId, {
      initProgressCallback: (report) => {
        if (onProgress) onProgress(report.progress, report.text);
      },
    });

    return this.localEngine;
  }

  async generateViaLocal(systemPrompt, userPrompt, onProgress) {
    try {
      const engine = await this.initLocalEngine(onProgress);
      const response = await engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 400,
      });
      return parseAIResponse(response.choices[0].message.content);
    } catch (err) {
      console.warn('Local AI failed, using fallback:', err);
      return generateFallbackScene(...arguments);
    }
  }

  // ─── API Mode ───────────────────────────────────────────────────────────

  async generateViaAPI(systemPrompt, userPrompt) {
    const baseUrl = this.apiBaseUrl.replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${res.status}`);
    }

    const data = await res.json();
    return parseAIResponse(data.choices[0].message.content);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function buildUserPrompt({ commit, prevCommit, style, gameState, playerChoice, currentCommitIndex, total }) {
  const progress = `${currentCommitIndex + 1}/${total}`;
  const timeOfDay = commit.hour < 6 ? 'dead of night' : commit.hour < 12 ? 'morning' : commit.hour < 18 ? 'afternoon' : 'evening';

  let prompt = `Repository event ${progress}:\n`;
  prompt += `Commit: "${commit.subject}"\n`;
  prompt += `Author: ${commit.author.name}\n`;
  prompt += `Time: ${timeOfDay}\n`;

  if (commit.body) prompt += `Details: ${commit.body.slice(0, 200)}\n`;
  if (prevCommit) prompt += `Previous event: "${prevCommit.subject}"\n`;

  if (playerChoice) prompt += `\nThe player chose: "${playerChoice}"\n`;

  prompt += `\nPlayer stats: HP ${gameState.hp}/100, XP ${gameState.xp}\n`;
  if (gameState.inventory.length) prompt += `Inventory: ${gameState.inventory.join(', ')}\n`;

  prompt += `\nNarrate this commit as a ${style} story event. Include the player's previous choice consequences if any. End with exactly 3 choices labeled [A], [B], [C].`;

  return prompt;
}

function parseAIResponse(text) {
  // Extract choices
  const choiceRegex = /\[([ABC])\]\s*(.+?)(?=\[[ABC]\]|$)/gs;
  const choices = [];
  let match;
  while ((match = choiceRegex.exec(text)) !== null) {
    choices.push({ label: match[1], text: match[2].trim() });
  }

  // Narrative is everything before the first [A]
  const firstChoiceIdx = text.search(/\[A\]/);
  const narrative = firstChoiceIdx > 0 ? text.slice(0, firstChoiceIdx).trim() : text.trim();

  // Fallback choices if parsing failed
  if (choices.length === 0) {
    choices.push(
      { label: 'A', text: 'Press forward boldly' },
      { label: 'B', text: 'Proceed with caution' },
      { label: 'C', text: 'Seek more information' },
    );
  }

  return { narrative, choices };
}

/**
 * Deterministic fallback when AI is unavailable
 */
export function generateFallbackScene({ commit, style, currentCommitIndex, total }) {
  const templates = {
    dnd: [
      `The ancient chronicles speak of "${commit.subject}". ${commit.author.name} the ${pickClass(commit)} stands at a crossroads, their quest ${Math.round((currentCommitIndex/total)*100)}% complete. The realm holds its breath.`,
      `A great deed was wrought this day: "${commit.subject}". The wizard ${commit.author.name} has altered the very fabric of the realm. Dark forces stir in response.`,
      `The guild records note that ${commit.author.name} has completed "${commit.subject}". Heroes gather to decide the next course of action.`,
    ],
    scifi: [
      `MISSION LOG ${currentCommitIndex + 1}/${total}: Crew member ${commit.author.name} reports: "${commit.subject}". Ship systems nominal. Awaiting orders.`,
      `ALERT: ${commit.author.name} has executed protocol "${commit.subject}". System integrity at ${Math.round(80 + Math.random()*20)}%. Multiple response vectors available.`,
      `TRANSMISSION RECEIVED from ${commit.author.name}: "${commit.subject}". The crew awaits your command, Captain.`,
    ],
    horror: [
      `The log entry reads, in ${commit.author.name}'s trembling hand: "${commit.subject}". Something has changed. You can feel it in the walls.`,
      `${commit.author.name} did something. The entry says "${commit.subject}". That was three days ago. No one has seen them since.`,
      `You find a note: "${commit.subject}" — signed by ${commit.author.name}. The ink is still fresh. Or is that something else?`,
    ],
  };

  const pool = templates[style] || templates.dnd;
  const narrative = pool[currentCommitIndex % pool.length];

  const choiceSets = {
    dnd: [
      { label: 'A', text: 'Draw your sword and face what lies ahead' },
      { label: 'B', text: 'Consult the ancient scrolls for guidance' },
      { label: 'C', text: 'Seek allies before proceeding' },
    ],
    scifi: [
      { label: 'A', text: 'Execute primary mission objective' },
      { label: 'B', text: 'Run diagnostics and assess the situation' },
      { label: 'C', text: 'Contact command for further instructions' },
    ],
    horror: [
      { label: 'A', text: 'Go deeper. You need to know the truth.' },
      { label: 'B', text: 'Stay where you are. Moving feels wrong.' },
      { label: 'C', text: 'Try to leave. While you still can.' },
    ],
  };

  return { narrative, choices: choiceSets[style] || choiceSets.dnd };
}

function pickClass(commit) {
  const msg = commit.subject.toLowerCase();
  if (/fix|bug/.test(msg)) return 'Paladin';
  if (/feat|add/.test(msg)) return 'Wizard';
  if (/refactor/.test(msg)) return 'Druid';
  if (/test/.test(msg)) return 'Ranger';
  if (/doc/.test(msg)) return 'Bard';
  return 'Adventurer';
}

export const aiEngine = new AIEngine();
