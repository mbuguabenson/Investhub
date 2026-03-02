'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface TestModeContextType {
  isTestMode: boolean
  toggleTestMode: () => void
}

const TestModeContext = createContext<TestModeContextType | undefined>(undefined)

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  const [isTestMode, setIsTestMode] = useState(false)

  // Persist test mode in local storage
  useEffect(() => {
    const stored = localStorage.getItem('isTestMode')
    if (stored === 'true') setIsTestMode(true)
  }, [])

  const toggleTestMode = () => {
    const newState = !isTestMode
    setIsTestMode(newState)
    localStorage.setItem('isTestMode', String(newState))
  }

  return (
    <TestModeContext.Provider value={{ isTestMode, toggleTestMode }}>
      {children}
    </TestModeContext.Provider>
  )
}

export function useTestMode() {
  const context = useContext(TestModeContext)
  if (context === undefined) {
    throw new Error('useTestMode must be used within a TestModeProvider')
  }
  return context
}
