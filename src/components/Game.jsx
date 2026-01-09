import React from 'react'

const Game = ({ farkle }) => {
  if (farkle.gameOver) {
    return (
      <div className="app">
        <h1>Farkle</h1>
        <h2>{farkle.winner} wins!</h2>
        <button onClick={farkle.resetGame}>New Game</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Farkle</h1>
      <div className="scores">
        {farkle.players.map((player, i) => (
          <div key={i} className={i === farkle.currentPlayer ? 'current' : ''}>
            {player.name}: {player.score}
          </div>
        ))}
        <div>Winning Score: {farkle.winningScore}</div>
        <div>Min Bank Score (First Turn): {farkle.minBankScore}</div>
      </div>
      <div className="turn">
        <p>Turn Score: {farkle.turnScore}</p>
        <p>{farkle.message}</p>
      </div>
      <div className="set-aside">
        {farkle.setAsideDice.map((aside, idx) => (
          <div key={idx} className="aside-group">
            <div className="aside-dice">
              {Array.from(aside.indices).map(i => <span key={i} className="aside-die">{farkle.dice[i]}</span>)}
            </div>
            <div>{aside.rule}: {aside.score}</div>
          </div>
        ))}
      </div>
      <div className="dice">
        {farkle.dice.map((die, i) => (
          <div
            key={i}
            className={`die ${farkle.selectedDice.has(i) ? 'selected' : ''} ${farkle.disabledDice.has(i) ? 'disabled' : ''} ${die === null ? 'blank' : ''}`}
            onClick={() => farkle.selectDie(i)}
          >
            {die || ''}
          </div>
        ))}
      </div>
      <div className="buttons">
        {(() => {
          const selectedValues = Array.from(farkle.selectedDice).map(i => farkle.dice[i])
          const selectedScore = farkle.calculateScore(selectedValues).score
          console.log('Selected values:', selectedValues, 'Score:', selectedScore)
          return (
            <>
              <button onClick={farkle.rollDice} disabled={!farkle.canRoll}>Roll</button>
              <button onClick={farkle.setAside} disabled={farkle.selectedDice.size === 0 || selectedScore === 0}>Set Aside</button>
              <button onClick={farkle.bankScore} disabled={farkle.turnScore === 0 || (!farkle.hasBanked[farkle.currentPlayer] && farkle.turnScore < farkle.minBankScore)}>Bank Score</button>
              <button onClick={() => farkle.setGameStarted(false)}>Exit Game</button>
            </>
          )
        })()}
      </div>
      <div className="legend">
        <h3>Scoring Rules</h3>
        <ul>
          {Object.entries(farkle.rules).filter(([key, value]) => value > 0).map(([key, value]) => (
            <li key={key}>{farkle.ruleNames[key]}: {value}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Game