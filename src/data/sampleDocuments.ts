import type { SourceDocument } from '../domain/types'

export const sampleExam: SourceDocument = {
  id: 'sample-exam',
  name: 'Cardio-Renal Block 3 Blueprint.pdf',
  role: 'exam',
  size: 482_000,
  text: `
    Acute coronary syndrome and myocardial infarction: plaque rupture, troponin kinetics, ST elevation localization, and acute management.
    Myocardial infarction complications and unstable angina will be integrated with clinical vignettes.
    Heart failure, ejection fraction, preload, afterload, cardiac output, pulmonary edema, and Frank Starling relationships.
    Aortic stenosis, mitral regurgitation, and murmur maneuvers.
    Acute kidney injury including prerenal azotemia, acute tubular necrosis, creatinine trends, and fractional excretion of sodium.
    Acid base interpretation: anion gap metabolic acidosis, metabolic alkalosis, respiratory compensation, and Winter formula.
    Nephritic syndrome, nephrotic syndrome, proteinuria, and red blood cell casts.
    Pharmacokinetics calculations: clearance, volume of distribution, loading dose, maintenance dose, and half life.
    Medical ethics cases involving informed consent, decision making capacity, confidentiality, and surrogate decision makers.
  `,
}

export const sampleResources: SourceDocument[] = [
  {
    id: 'sample-resource-1',
    name: 'Rapid Review Cardiology.pdf',
    role: 'resource',
    size: 1_240_000,
    text: `
      Myocardial infarction, stable angina, troponin, ST elevation and acute coronary syndrome are reviewed with practice questions.
      Heart failure includes ejection fraction, preload, afterload, cardiac output, pulmonary edema, and Frank Starling curves.
      Aortic stenosis, aortic regurgitation, mitral stenosis, mitral regurgitation and murmur maneuvers are summarized.
      Pharmacokinetics covers volume of distribution, clearance, half life, steady state, loading dose, maintenance dose, and first order kinetics.
    `,
  },
  {
    id: 'sample-resource-2',
    name: 'Core Concepts Question Notes.docx',
    role: 'resource',
    size: 654_000,
    text: `
      Prerenal azotemia and creatinine changes are discussed briefly.
      Metabolic acidosis and anion gap are introduced.
      Informed consent and confidentiality are discussed in patient communication.
      Volume of distribution and loading dose practice.
    `,
  },
]
