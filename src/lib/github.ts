import { storage } from './storage'
import type { Commit, Analysis, PopularRepo, RateLimitStatus } from '@/types'

const GITHUB_API = 'https://api.github.com'

let rateLimit: RateLimitStatus = { remaining: null, reset: null }

export function getRateLimitStatus(): RateLimitStatus {
  return { ...rateLimit }
}

function updateRateLimitFromHeaders(headers: Headers) {
  const remaining = headers.get('X-RateLimit-Remaining')
  const reset = headers.get('X-RateLimit-Reset')
  if (remaining !== null) rateLimit.remaining = parseInt(remaining, 10)
  if (reset !== null) rateLimit.reset = parseInt(reset, 10)
  window.dispatchEvent(new CustomEvent('github-ratelimit-update', { detail: { ...rateLimit } }))
}

export const POPULAR_REPOS: PopularRepo[] = [
  { owner: 'facebook', repo: 'react', desc: 'The library for web and native user interfaces', stars: '228k', lang: 'JavaScript' },
  { owner: 'microsoft', repo: 'vscode', desc: 'Visual Studio Code — open source code editor', stars: '165k', lang: 'TypeScript' },
  { owner: 'torvalds', repo: 'linux', desc: 'Linux kernel source tree', stars: '183k', lang: 'C' },
  { owner: 'golang', repo: 'go', desc: 'The Go programming language', stars: '124k', lang: 'Go' },
  { owner: 'rust-lang', repo: 'rust', desc: 'Empowering everyone to build reliable software', stars: '98k', lang: 'Rust' },
  { owner: 'vuejs', repo: 'vue', desc: 'The Progressive JavaScript Framework', stars: '207k', lang: 'TypeScript' },
  { owner: 'tensorflow', repo: 'tensorflow', desc: 'An Open Source Machine Learning Framework', stars: '186k', lang: 'Python' },
  { owner: 'kubernetes', repo: 'kubernetes', desc: 'Production-Grade Container Scheduling', stars: '111k', lang: 'Go' },
  { owner: 'denoland', repo: 'deno', desc: 'A modern runtime for JavaScript and TypeScript', stars: '98k', lang: 'Rust' },
  { owner: 'vercel', repo: 'next.js', desc: 'The React Framework for the Web', stars: '127k', lang: 'JavaScript' },
  { owner: 'neovim', repo: 'neovim', desc: 'Vim-fork focused on extensibility and usability', stars: '82k', lang: 'Lua' },
  { owner: 'ollama', repo: 'ollama', desc: 'Get up and running with large language models', stars: '98k', lang: 'Go' },
]

export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  input = input.trim().replace(/\/$/, '')
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }
  const shortMatch = input.match(/^([^/]+)\/([^/]+)$/)
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }
  return null
}

export async function fetchRepoInfo(owner: string, repo: string, token: string | null = null) {
  const cacheKey = `repo:${owner}/${repo}`
  const cached = storage.getCache(cacheKey)
  if (cached) return cached

  const headers = buildHeaders(token)
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers })
  updateRateLimitFromHeaders(res.headers)

  if (!res.ok) {
    if (res.status === 404) throw new Error(`Repository "${owner}/${repo}" not found.`)
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Add a GitHub token in settings.')
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const data = await res.json()
  storage.setCache(cacheKey, data)
  return data
}

export async function fetchCommits(
  owner: string,
  repo: string,
  token: string | null = null,
  maxCommits = 100,
): Promise<Commit[]> {
  const cacheKey = `commits:${owner}/${repo}:${maxCommits}`
  const cached = storage.getCache<Commit[]>(cacheKey)
  if (cached) return cached.map(c => ({ ...c, date: new Date(c.timestamp) }))

  const headers = buildHeaders(token)
  const perPage = Math.min(maxCommits, 100)
  const pages = Math.ceil(maxCommits / perPage)
  const commits: Commit[] = []

  for (let page = 1; page <= pages; page++) {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`
    const res = await fetch(url, { headers })
    updateRateLimitFromHeaders(res.headers)

    if (!res.ok) {
      if (res.status === 409) break
      if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Add a GitHub token in settings.')
      throw new Error(`Failed to fetch commits: ${res.status}`)
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break
    commits.push(...data)
    if (data.length < perPage) break
  }

  const parsedCommits = commits.map(parseCommit)
  storage.setCache(cacheKey, parsedCommits)
  return parsedCommits
}

function parseCommit(raw: any): Commit {
  const c = raw.commit
  const author = c.author || {}
  const date = new Date(author.date || Date.now())

  return {
    sha: raw.sha,
    shortSha: raw.sha.slice(0, 7),
    message: c.message || '',
    subject: (c.message || '').split('\n')[0].slice(0, 120),
    body: (c.message || '').split('\n').slice(2).join('\n').trim(),
    author: {
      name: author.name || raw.author?.login || 'Unknown',
      login: raw.author?.login || null,
      avatar: raw.author?.avatar_url || null,
    },
    date,
    hour: date.getHours(),
    dayOfWeek: date.getDay(),
    timestamp: date.getTime(),
    stats: null,
  }
}

export function analyzeCommits(commits: Commit[]): Analysis {
  const authors = [...new Set(commits.map(c => c.author.name))]
  const totalCommits = commits.length

  const hourCounts = new Array(24).fill(0)
  commits.forEach(c => hourCounts[c.hour]++)
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts))

  const avgMsgLen = commits.reduce((s, c) => s + c.subject.length, 0) / totalCommits
  const fixCount = commits.filter(c => /fix|bug|patch|hotfix/i.test(c.subject)).length
  const featCount = commits.filter(c => /feat|add|new|implement/i.test(c.subject)).length
  const refactorCount = commits.filter(c => /refactor|clean|improve|update/i.test(c.subject)).length

  const oldest = commits[commits.length - 1].timestamp
  const newest = commits[0].timestamp
  const daySpan = Math.max(1, (newest - oldest) / (1000 * 60 * 60 * 24))
  const commitsPerDay = totalCommits / daySpan

  const hashSeed = commits.slice(0, 5).reduce((acc, c) => acc ^ parseInt(c.sha.slice(0, 8), 16), 0)

  return {
    totalCommits,
    authors,
    authorCount: authors.length,
    peakHour,
    avgMsgLen,
    fixRatio: fixCount / totalCommits,
    featRatio: featCount / totalCommits,
    refactorRatio: refactorCount / totalCommits,
    commitsPerDay,
    daySpan,
    hashSeed,
    music: {
      bpm: Math.round(60 + Math.min(80, commitsPerDay * 8)),
      voices: Math.min(4, Math.max(1, authors.length)),
      mode: peakHour >= 6 && peakHour <= 18 ? 'major' : 'minor',
      complexity: Math.min(1, (fixCount + refactorCount) / Math.max(1, totalCommits) * 3),
      energy: Math.min(1, commitsPerDay / 10),
    },
  }
}

function buildHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers['Authorization'] = `Bearer ${token.trim()}`
  return headers
}
