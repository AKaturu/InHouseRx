export type DocumentRole = 'exam' | 'resource'

export interface SourceDocument {
  id: string
  name: string
  role: DocumentRole
  text: string
  size: number
  extractionMethod?: 'browser' | 'local-transcriber'
  warnings?: string[]
}

export type TopicStatus = 'critical' | 'moderate' | 'covered' | 'strong'

export interface TopicDefinition {
  id: string
  name: string
  system: string
  aliases: string[]
  relevance: number
  action: string
}

export interface TopicResult {
  id: string
  name: string
  system: string
  examEmphasis: number
  resourceCoverage: number
  gap: number
  status: TopicStatus
  evidence: string[]
  action: string
}

export interface SystemCoverage {
  name: string
  examEmphasis: number
  resourceCoverage: number
}

export interface AnalysisReportModel {
  id: string
  createdAt: string
  examName: string
  resourceNames: string[]
  readinessScore: number
  criticalGaps: number
  moderateGaps: number
  strongAreas: number
  recognizedTopics: number
  localTranscriberAssisted: boolean
  extractionWarnings: string[]
  topicResults: TopicResult[]
  systemCoverage: SystemCoverage[]
}
