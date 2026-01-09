import React from 'react'
import './App.css'
import useFarkle from './hooks/useFarkle'
import Setup from './components/Setup'
import Game from './components/Game'

function App() {
  const farkle = useFarkle()

  return (
    <div>
      {!farkle.gameStarted ? <Setup farkle={farkle} /> : <Game farkle={farkle} />}
    </div>
  )
}

export default App