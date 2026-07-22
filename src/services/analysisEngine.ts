import { topicTaxonomy } from '../domain/topicTaxonomy'
import type { AnalysisReportModel, SourceDocument, SystemCoverage, TopicDefinition, TopicResult, TopicStatus } from '../domain/types'

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[–—-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const countPhrase = (text: string, phrase: string) => {
  const normalizedPhrase = normalize(phrase)
  if (!normalizedPhrase) return 0
  return text.match(new RegExp(`\\b${escapeRegExp(normalizedPhrase).replace(/\s+/g, '\\s+')}\\b`, 'g'))?.length ?? 0
}

const scoreTopic = (texts: string[], topic: TopicDefinition) => {
  const normalizedTexts = texts.map(normalize)
  const combined = normalizedTexts.join(' ')
  const hits = topic.aliases.map((alias) => ({ alias, count: countPhrase(combined, alias) }))
  const distinct = hits.filter((hit) => hit.count > 0)
  const totalHits = hits.reduce((sum, hit) => sum + Math.min(hit.count, 4), 0)
  const documentSpread = normalizedTexts.filter((text) => topic.aliases.some((alias) => countPhrase(text, alias) > 0)).length

  if (!distinct.length) return { score: 0, evidence: [] as string[] }

  const breadth = Math.min(1, distinct.length / Math.min(5, topic.aliases.length))
  const repetition = Math.min(1, totalHits / 8)
  const spread = Math.min(1, documentSpread / Math.max(1, normalizedTexts.length))
  const score = Math.min(100, Math.round((breadth * 0.62 + repetition * 0.28 + spread * 0.1) * 100))

  return {
    score,
    evidence: distinct
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((hit) => hit.alias),
  }
}

const getStatus = (examEmphasis: number, resourceCoverage: number): TopicStatus => {
  const gap = Math.max(0, examEmphasis - resourceCoverage)
  if (gap >= 35 && examEmphasis >= 40) return 'critical'
  if (gap >= 15) return 'moderate'
  if (resourceCoverage >= examEmphasis + 20) return 'strong'
  return 'covered'
}

const buildSystemCoverage = (topics: TopicResult[]): SystemCoverage[] => {
  const systems = new Map<string, { exam: number; resource: number; count: number }>()

  topics.forEach((topic) => {
    const current = systems.get(topic.system) ?? { exam: 0, resource: 0, count: 0 }
    systems.set(topic.system, {
      exam: current.exam + topic.examEmphasis,
      resource: current.resource + topic.resourceCoverage,
      count: current.count + 1,
    })
  })

  return [...systems.entries()]
    .map(([name, values]) => ({
      name,
      examEmphasis: Math.round(values.exam / values.count),
      resourceCoverage: Math.round(values.resource / values.count),
    }))
    .sort((a, b) => b.examEmphasis - a.examEmphasis)
}

export const analyzeDocuments = (exam: SourceDocument, resources: SourceDocument[]): AnalysisReportModel => {
  if (!exam.text.trim()) throw new Error('The in-house exam does not contain readable text.')
  if (!resources.length) throw new Error('Add at least one study resource before analysis.')

  const topicResults = topicTaxonomy
    .map((topic): (TopicResult & { priority: number; relevance: number }) | null => {
      const examResult = scoreTopic([exam.text], topic)
      if (!examResult.score) return null

      const resourceResult = scoreTopic(resources.map((resource) => resource.text), topic)
      const gap = Math.max(0, examResult.score - resourceResult.score)
      return {
        id: topic.id,
        name: topic.name,
        system: topic.system,
        examEmphasis: examResult.score,
        resourceCoverage: resourceResult.score,
        gap,
        status: getStatus(examResult.score, resourceResult.score),
        evidence: examResult.evidence,
        action: topic.action,
        priority: Math.round((gap * 0.72 + examResult.score * 0.28) * topic.relevance),
        relevance: topic.relevance,
      }
    })
    .filter((topic): topic is TopicResult & { priority: number; relevance: number } => Boolean(topic))
    .sort((a, b) => b.priority - a.priority)

  if (!topicResults.length) {
    throw new Error('No supported medical topics were recognized. Try a more detailed exam blueprint or review document.')
  }

  const weightedExam = topicResults.reduce((sum, topic) => sum + topic.examEmphasis * topic.relevance, 0)
  const weightedCovered = topicResults.reduce(
    (sum, topic) => sum + Math.min(topic.examEmphasis, topic.resourceCoverage) * topic.relevance,
    0,
  )
  const readinessScore = Math.round((weightedCovered / weightedExam) * 100)
  const cleanedTopics: TopicResult[] = topicResults.map((topic) => ({
    id: topic.id,
    name: topic.name,
    system: topic.system,
    examEmphasis: topic.examEmphasis,
    resourceCoverage: topic.resourceCoverage,
    gap: topic.gap,
    status: topic.status,
    evidence: topic.evidence,
    action: topic.action,
  }))

  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    examName: exam.name,
    resourceNames: resources.map((resource) => resource.name),
    readinessScore,
    criticalGaps: cleanedTopics.filter((topic) => topic.status === 'critical').length,
    moderateGaps: cleanedTopics.filter((topic) => topic.status === 'moderate').length,
    strongAreas: cleanedTopics.filter((topic) => topic.status === 'strong' || topic.status === 'covered').length,
    recognizedTopics: cleanedTopics.length,
    localTranscriberAssisted: [exam, ...resources].some((document) => document.extractionMethod === 'local-transcriber'),
    extractionWarnings: [exam, ...resources].flatMap((document) => document.warnings ?? []),
    topicResults: cleanedTopics,
    systemCoverage: buildSystemCoverage(cleanedTopics),
  }
}
