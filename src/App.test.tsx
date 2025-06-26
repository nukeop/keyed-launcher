import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /based launcher v3/i })).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/type to search/i)).toBeInTheDocument()
  })

  it('renders the instruction text', () => {
    render(<App />)
    expect(screen.getByText(/press escape to hide/i)).toBeInTheDocument()
  })
})
