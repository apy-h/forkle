import React, { useState, useEffect } from 'react'
import './App.css'
import useFarkle from './hooks/useFarkle'
import Setup from './components/Setup'
import Game from './components/Game'

function App() {
  const farkle = useFarkle()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div>
      {!farkle.gameStarted ? <Setup farkle={farkle} theme={theme} toggleTheme={toggleTheme} /> : <Game farkle={farkle} theme={theme} toggleTheme={toggleTheme} />}
    </div>
  )
}

export default App