const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
const CHARTS_FILE = process.env.CHARTS_FILE || 'charts.json'

let chartsMap = null

async function loadChartsMap() {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${CHARTS_FILE}`
  const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}

  const response = await fetch(url, { headers })

  if (!response.ok) throw new Error(`Erro ao carregar ${CHARTS_FILE}: HTTP ${response.status}`)

  chartsMap = await response.json()
}

export async function fetchChartHelp(chartId) {
  if (!chartsMap) await loadChartsMap()

  const text = chartsMap[chartId]
  if (!text) return null

  return { id: chartId, content: text }
}

export function invalidateChartsMap() {
  chartsMap = null
}
