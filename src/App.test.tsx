import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('InHouseRx application', () => {
  it('presents the branded upload workflow and privacy boundary', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'InHouseRx home' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Find what your study resources/i })).toBeInTheDocument()
    expect(screen.getByText('Private, on-device analysis')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyze coverage' })).toBeInTheDocument()
  })

  it('requires both sides of the comparison before analysis', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Analyze coverage' }))

    expect(screen.getByText('Add one in-house exam or exam blueprint.')).toBeInTheDocument()
    expect(screen.getByText('Add at least one study resource.')).toBeInTheDocument()
    expect(screen.getByText('Your analysis needs both sides of the comparison.')).toBeInTheDocument()
  })

  it('opens a complete report from the sample-data path and can reset', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /View sample report/i }))
    expect(screen.getByRole('heading', { name: /Comparing topic emphasis/i })).toBeInTheDocument()

    await waitFor(() => expect(screen.getByRole('heading', { name: /Your highest-yield gaps/i })).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByText('Resource alignment')).toBeInTheDocument()
    expect(screen.getByText('Study these first')).toBeInTheDocument()
    expect(screen.getAllByText(/Detected in exam/i).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /New analysis/i }))
    expect(screen.getByRole('heading', { name: /Compare your coverage/i })).toBeInTheDocument()
  })
})
