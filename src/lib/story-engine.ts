import { storage } from './storage'
import { aiEngine, generateFallbackScene } from './ai-engine'
import type { GameState, Scene, Commit, Analysis, Style, QuestEntry, PlayerStats } from '@/types'

const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]

function createInitialState(
  repo: { owner: string; repo: string },
  style: Style,
  commits: Commit[],
  analysis: Analysis,
): GameState {
  return {
    repo,
    style,
    commits,
    analysis,
    commitIndex: 0,
    chapter: 1,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    inventory: [],
    questLog: [],
    history: [],
    currentScene: { narrative: '', choices: [] },
    startedAt: Date.now(),
    savedAt: null,
  }
}

class StoryEngine {
  state: GameState | null = null
  onSceneReady: ((scene: Scene, commit: Commit | null) => void) | null = null
  onStatsUpdate: ((stats: PlayerStats) => void) | null = null
  onQuestUpdate: ((quests: QuestEntry[]) => void) | null = null
  private generating = false

  async startGame(repo: { owner: string; repo: string }, style: Style, commits: Commit[], analysis: Analysis): Promise<GameState> {
    this.state = createInitialState(repo, style, commits, analysis)
    await this.generateNextScene()
    return this.state
  }

  loadGame(slot: string): GameState {
    const saved = storage.loadGame(slot)
    if (!saved) throw new Error('Save not found')
    this.state = saved
    return this.state
  }

  saveGame(slot = 'auto') {
    if (!this.state) return
    this.state.savedAt = Date.now()
    storage.saveGame(slot, this.state)
  }

  async makeChoice(choiceInput: number | string) {
    if (!this.state || this.generating) return
    const scene = this.state.currentScene

    let choice: { label: string; text: string }
    if (typeof choiceInput === 'number') {
      if (!scene?.choices[choiceInput]) return
      choice = scene.choices[choiceInput]
    } else {
      choice = { label: 'Player', text: choiceInput }
    }

    this.state.history.push({
      narrative: scene.narrative,
      choice: choice.text,
      commitSha: this.state.commits[this.state.commitIndex]?.sha || '',
    })

    this.applyChoiceConsequences(choice)

    this.state.commitIndex = Math.min(this.state.commitIndex + 1, this.state.commits.length - 1)
    this.state.chapter = Math.floor(this.state.commitIndex / 10) + 1

    if (this.state.commitIndex >= this.state.commits.length - 1 && this.state.history.length > 1) {
      await this.generateEpilogue()
      return
    }

    await this.generateNextScene(choice.text)
    this.saveGame('auto')
  }

  private applyChoiceConsequences(choice: { label: string; text: string }) {
    if (!this.state) return
    const { style } = this.state
    const commit = this.state.commits[this.state.commitIndex]

    const xpGain = 20 + Math.floor(Math.random() * 30)
    this.state.xp += xpGain

    const nextLevelXp = XP_PER_LEVEL[this.state.level] || 9999
    if (this.state.xp >= nextLevelXp && this.state.level < 10) {
      this.state.level++
      this.state.maxHp += 10
      this.state.hp = Math.min(this.state.hp + 20, this.state.maxHp)
      this.addQuestEntry(`Level ${this.state.level} reached!`)
    }

    const msg = commit?.subject?.toLowerCase() || ''
    if (/fix|bug|patch/.test(msg)) {
      let hpDelta = 0
      if (choice.label === 'A') hpDelta = -10
      else if (choice.label === 'C') hpDelta = 5
      else if (choice.label === 'Player') hpDelta = Math.random() > 0.5 ? -5 : 5
      this.state.hp = Math.max(1, Math.min(this.state.maxHp, this.state.hp + hpDelta))
    }

    if (/feat|add|new/.test(msg) && Math.random() > 0.6) {
      const items: Record<Style, string[]> = {
        dnd: ['Magic Scroll', 'Enchanted Sword', 'Ancient Tome', 'Healing Potion', 'Dragon Scale'],
        scifi: ['Energy Cell', 'Neural Chip', 'Plasma Rifle', 'Nano-med Kit', 'Quantum Drive'],
        horror: ['Torn Page', 'Rusty Key', 'Strange Amulet', 'Faded Photo', 'Cracked Mirror'],
      }
      const pool = items[style] || items.dnd
      const item = pool[Math.floor(Math.random() * pool.length)]
      if (!this.state.inventory.includes(item) && this.state.inventory.length < 8) {
        this.state.inventory.push(item)
      }
    }

    if (/refactor|clean/.test(msg)) this.addQuestEntry('The Great Restructuring begins...')
    if (/release|version|v\d/.test(msg)) this.addQuestEntry('A new era dawns!')
    if (/merge/.test(msg)) this.addQuestEntry('Factions united (or divided)')

    if (this.onStatsUpdate) {
      this.onStatsUpdate({
        hp: this.state.hp,
        maxHp: this.state.maxHp,
        xp: this.state.xp,
        level: this.state.level,
        inventory: this.state.inventory,
      })
    }
  }

  private addQuestEntry(text: string) {
    if (!this.state) return
    this.state.questLog.unshift({ text, chapter: this.state.chapter })
    if (this.state.questLog.length > 10) this.state.questLog.pop()
    if (this.onQuestUpdate) this.onQuestUpdate(this.state.questLog)
  }

  async generateNextScene(playerChoice: string | null = null) {
    if (this.generating || !this.state) return
    this.generating = true

    try {
      let scene: Scene
      try {
        scene = await aiEngine.generateScene({
          commits: this.state.commits,
          currentCommitIndex: this.state.commitIndex,
          style: this.state.style,
          gameState: { hp: this.state.hp, xp: this.state.xp, inventory: this.state.inventory },
          playerChoice,
        })
      } catch (err) {
        console.warn('AI generation failed, using fallback:', err)
        scene = generateFallbackScene({
          commit: this.state.commits[this.state.commitIndex],
          style: this.state.style,
          currentCommitIndex: this.state.commitIndex,
          total: this.state.commits.length,
        })
      }

      this.state.currentScene = scene

      // Shuffle choices
      if (scene.choices && scene.choices.length) {
        for (let i = scene.choices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[scene.choices[i], scene.choices[j]] = [scene.choices[j], scene.choices[i]]
        }
      }

      if (this.onSceneReady) this.onSceneReady(scene, this.state.commits[this.state.commitIndex])
    } finally {
      this.generating = false
    }
  }

  async generateEpilogue() {
    if (!this.state) return
    const epilogues: Record<Style, string> = {
      dnd: `The chronicles are complete. ${this.state.commits.length} quests have been recorded in the great tome. The realm stands transformed by your choices. Your legend will be sung for ages to come. HP: ${this.state.hp}/${this.state.maxHp} | Level: ${this.state.level} | XP: ${this.state.xp}`,
      scifi: `MISSION COMPLETE. All ${this.state.commits.length} mission logs have been processed. The ship's journey is recorded in the annals of the fleet. Your decisions have shaped the future of the crew. Final Status: HP ${this.state.hp}/${this.state.maxHp} | Rank: ${this.state.level} | Merit: ${this.state.xp}`,
      horror: `It's over. Or is it? You've witnessed all ${this.state.commits.length} events in this cursed repository. You survived. Most don't. The code remains. It always remains. HP: ${this.state.hp}/${this.state.maxHp} | Sanity: ${this.state.level * 10}%`,
    }

    const scene: Scene = {
      narrative: epilogues[this.state.style] || epilogues.dnd,
      choices: [
        { label: 'A', text: 'Begin a new quest with another repository' },
        { label: 'B', text: 'Replay this adventure with a different style' },
        { label: 'C', text: 'Return to the beginning' },
      ],
      isEpilogue: true,
    }

    this.state.currentScene = scene
    if (this.onSceneReady) this.onSceneReady(scene, null)
  }

  getProgress(): number {
    if (!this.state) return 0
    return this.state.commitIndex / Math.max(1, this.state.commits.length - 1)
  }

  getCurrentCommit(): Commit | null {
    if (!this.state) return null
    return this.state.commits[this.state.commitIndex] || null
  }
}

export const storyEngine = new StoryEngine()
