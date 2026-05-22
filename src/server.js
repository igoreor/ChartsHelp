import 'dotenv/config'
import express from 'express'
import { fetchChartHelp } from './github.js'
import { getCache, setCache } from './cache.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
  next()
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/chart-help/:chartId', async (req, res) => {
  const { chartId } = req.params

  const cached = getCache(chartId)
  if (cached) return res.json(cached)

  try {
    const data = await fetchChartHelp(chartId)

    if (!data) {
      return res.status(404).json({ error: `Nenhum conteúdo de ajuda encontrado para "${chartId}"` })
    }

    setCache(chartId, data)
    res.json(data)
  } catch (err) {
    console.error(`[chart-help] Erro ao buscar "${chartId}":`, err.message)
    res.status(500).json({ error: 'Erro ao buscar conteúdo de ajuda' })
  }
})

app.listen(PORT, () => {
  console.log(`Charts Help API rodando na porta ${PORT}`)
})
