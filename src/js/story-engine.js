/**
 * GitQuest — story-engine.js
 * Game state machine: manages narrative progression, player stats, choices
 */

import { storage } from './storage.js';
import { aiEngine, generateFallbackScene } from './ai-engine.js';

// ─── Initial State ─────────────────────────────────────────────────────────

function createInitialState(repo, style, commits, analysis) {
  return {
    repo,           // { owner, repo }
    style,          // 'dnd' | 'scifi' | 'horror'
    commits,        // parsed commit array
    analysis,       // commit analysis
    commitIndex: 0, // current commit being narrated
    chapter: 1,

    // Player stats
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    inventory: [],
    questLog: [],

    // Story state
    history: [],    // array of { narrative, choice, commitSha }
    currentScene: null,

    // Meta
    startedAt: Date.now(),
    savedAt: null,
  };
}

// ─── XP thresholds per level ──────────────────────────────────────────────
const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

// ─── Story Engine ──────────────────────────────────────────────────────────

class StoryEngine {
  constructor() {
    this.state = null;
    this.onSceneReady = null;   // callback(scene)
    this.onStatsUpdate = null;  // callback(stats)
    this.onQuestUpdate = null;  // callback(quests)
    this.onGameOver = null;     // callback(reason)
    this.generating = false;
  }

  /**
   * Start a new game
   */
  async startGame(repo, style, commits, analysis) {
    this.state = createInitialState(repo, style, commits, analysis);
    await this.generateNextScene();
    return this.state;
  }

  /**
   * Load a saved game
   */
  loadGame(slot) {
    const saved = storage.loadGame(slot);
    if (!saved) throw new Error('Save not found');
    this.state = saved;
    return this.state;
  }

  /**
   * Save current game
   */
  saveGame(slot = 'auto') {
    if (!this.state) return;
    this.state.savedAt = Date.now();
    storage.saveGame(slot, this.state);
  }

  /**
   * Player makes a choice
   */
  async makeChoice(choiceIndex) {
    if (!this.state || this.generating) return;
    const scene = this.state.currentScene;
    if (!scene || !scene.choices[choiceIndex]) return;

    const choice = scene.choices[choiceIndex];

    // Record history
    this.state.history.push({
      narrative: scene.narrative,
      choice: choice.text,
      commitSha: this.state.commits[this.state.commitIndex]?.sha,
    });

    // Apply choice consequences
    this.applyChoiceConsequences(choice, choiceIndex);

    // Advance to next commit
    this.state.commitIndex = Math.min(
      this.state.commitIndex + 1,
      this.state.commits.length - 1
    );

    // Update chapter every ~10 commits
    this.state.chapter = Math.floor(this.state.commitIndex / 10) + 1;

    // Check end condition
    if (this.state.commitIndex >= this.state.commits.length - 1 && this.state.history.length > 1) {
      await this.generateEpilogue();
      return;
    }

    // Generate next scene
    await this.generateNextScene(choice.text);

    // Auto-save
    this.saveGame('auto');
  }

  /**
   * Apply stat changes based on choice
   */
  applyChoiceConsequences(choice, index) {
    const { style } = this.state;
    const commit = this.state.commits[this.state.commitIndex];

    // XP gain (always)
    const xpGain = 20 + Math.floor(Math.random() * 30);
    this.state.xp += xpGain;

    // Level up check
    const nextLevelXp = XP_PER_LEVEL[this.state.level] || 9999;
    if (this.state.xp >= nextLevelXp && this.state.level < 10) {
      this.state.level++;
      this.state.maxHp += 10;
      this.state.hp = Math.min(this.state.hp + 20, this.state.maxHp);
      this.addQuestEntry(`Level ${this.state.level} reached!`);
    }

    // HP changes based on commit type
    const msg = commit?.subject?.toLowerCase() || '';
    if (/fix|bug|patch/.test(msg)) {
      // Risky choice (index 0 = bold) costs HP, safe choice gains
      const hpDelta = index === 0 ? -10 : index === 2 ? 5 : 0;
      this.state.hp = Math.max(1, Math.min(this.state.maxHp, this.state.hp + hpDelta));
    }

    // Inventory items from notable commits
    if (/feat|add|new/.test(msg) && Math.random() > 0.6) {
      const items = {
        dnd: ['Magic Scroll', 'Enchanted Sword', 'Ancient Tome', 'Healing Potion', 'Dragon Scale'],
        scifi: ['Energy Cell', 'Neural Chip', 'Plasma Rifle', 'Nano-med Kit', 'Quantum Drive'],
        horror: ['Torn Page', 'Rusty Key', 'Strange Amulet', 'Faded Photo', 'Cracked Mirror'],
      };
      const pool = items[style] || items.dnd;
      const item = pool[Math.floor(Math.random() * pool.length)];
      if (!this.state.inventory.includes(item) && this.state.inventory.length < 8) {
        this.state.inventory.push(item);
      }
    }

    // Quest log entries
    if (/refactor|clean/.test(msg)) this.addQuestEntry('The Great Restructuring begins...');
    if (/release|version|v\d/.test(msg)) this.addQuestEntry('A new era dawns!');
    if (/merge/.test(msg)) this.addQuestEntry('Factions united (or divided)');

    // Notify UI
    if (this.onStatsUpdate) {
      this.onStatsUpdate({
        hp: this.state.hp,
        maxHp: this.state.maxHp,
        xp: this.state.xp,
        level: this.state.level,
        inventory: this.state.inventory,
      });
    }
  }

  addQuestEntry(text) {
    this.state.questLog.unshift({ text, chapter: this.state.chapter });
    if (this.state.questLog.length > 10) this.state.questLog.pop();
    if (this.onQuestUpdate) this.onQuestUpdate(this.state.questLog);
  }

  /**
   * Generate the next scene via AI
   */
  async generateNextScene(playerChoice = null) {
    if (this.generating) return;
    this.generating = true;

    try {
      let scene;
      try {
        scene = await aiEngine.generateScene({
          commits: this.state.commits,
          currentCommitIndex: this.state.commitIndex,
          style: this.state.style,
          gameState: {
            hp: this.state.hp,
            xp: this.state.xp,
            inventory: this.state.inventory,
          },
          playerChoice,
        });
      } catch (err) {
        console.warn('AI generation failed, using fallback:', err);
        scene = generateFallbackScene({
          commit: this.state.commits[this.state.commitIndex],
          style: this.state.style,
          currentCommitIndex: this.state.commitIndex,
          total: this.state.commits.length,
        });
      }

      this.state.currentScene = scene;
      if (this.onSceneReady) this.onSceneReady(scene, this.state.commits[this.state.commitIndex]);
    } finally {
      this.generating = false;
    }
  }

  /**
   * Generate epilogue when all commits are narrated
   */
  async generateEpilogue() {
    const epilogues = {
      dnd: `The chronicles are complete. ${this.state.commits.length} quests have been recorded in the great tome. The realm stands transformed by your choices. Your legend will be sung for ages to come. HP: ${this.state.hp}/${this.state.maxHp} | Level: ${this.state.level} | XP: ${this.state.xp}`,
      scifi: `MISSION COMPLETE. All ${this.state.commits.length} mission logs have been processed. The ship's journey is recorded in the annals of the fleet. Your decisions have shaped the future of the crew. Final Status: HP ${this.state.hp}/${this.state.maxHp} | Rank: ${this.state.level} | Merit: ${this.state.xp}`,
      horror: `It's over. Or is it? You've witnessed all ${this.state.commits.length} events in this cursed repository. You survived. Most don't. The code remains. It always remains. HP: ${this.state.hp}/${this.state.maxHp} | Sanity: ${this.state.level * 10}%`,
    };

    const scene = {
      narrative: epilogues[this.state.style] || epilogues.dnd,
      choices: [
        { label: 'A', text: 'Begin a new quest with another repository' },
        { label: 'B', text: 'Replay this adventure with a different style' },
        { label: 'C', text: 'Return to the beginning' },
      ],
      isEpilogue: true,
    };

    this.state.currentScene = scene;
    if (this.onSceneReady) this.onSceneReady(scene, null);
  }

  getProgress() {
    if (!this.state) return 0;
    return this.state.commitIndex / Math.max(1, this.state.commits.length - 1);
  }

  getCurrentCommit() {
    if (!this.state) return null;
    return this.state.commits[this.state.commitIndex] || null;
  }
}

export const storyEngine = new StoryEngine();
