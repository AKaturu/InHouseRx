import { describe, expect, it } from 'vitest'
import { sampleExam, sampleResources } from '../data/sampleDocuments'
import type { SourceDocument } from '../domain/types'
import { analyzeDocuments } from './analysisEngine'

const resource = (text: string): SourceDocument => ({
  id: 'resource-test',
  name: 'resource.txt',
  role: 'resource',
  size: text.length,
  text,
})

describe('analyzeDocuments', () => {
  it('creates a prioritized, explainable report for the sample case', () => {
    const report = analyzeDocuments(sampleExam, sampleResources)

    expect(report.examName).toBe(sampleExam.name)
    expect(report.resourceNames).toHaveLength(2)
    expect(report.recognizedTopics).toBeGreaterThanOrEqual(7)
    expect(report.readinessScore).toBeGreaterThan(0)
    expect(report.readinessScore).toBeLessThan(100)
    expect(report.criticalGaps + report.moderateGaps).toBeGreaterThan(0)
    expect(report.topicResults[0].gap).toBeGreaterThanOrEqual(report.topicResults.at(-1)!.gap)
    expect(report.topicResults[0].evidence.length).toBeGreaterThan(0)
    expect(report.topicResults[0].action).toBeTruthy()
  })

  it('increases readiness when resources cover more exam terminology', () => {
    const sparse = analyzeDocuments(sampleExam, [resource('This resource briefly mentions creatinine and informed consent.')])
    const comprehensive = analyzeDocuments(sampleExam, [resource(sampleExam.text)])

    expect(comprehensive.readinessScore).toBe(100)
    expect(comprehensive.readinessScore).toBeGreaterThan(sparse.readinessScore)
    expect(comprehensive.criticalGaps).toBe(0)
  })

  it('rejects an exam with no recognized topics instead of fabricating gaps', () => {
    const unknownExam: SourceDocument = { ...sampleExam, text: 'Course logistics, room assignments, and attendance policy.' }

    expect(() => analyzeDocuments(unknownExam, sampleResources)).toThrow('No supported medical topics were recognized')
  })

  it('requires at least one resource', () => {
    expect(() => analyzeDocuments(sampleExam, [])).toThrow('Add at least one study resource')
  })
})
