import React, { useState } from 'react'

const ruleOrder = ['single1', 'single5', 'three1', 'three2', 'three3', 'three4', 'three5', 'three6', 'fourOfAKind', 'fiveOfAKind', 'sixOfAKind', 'straight', 'threePairs', 'fourOfAKindAndPair', 'twoTriplets']

const Game = ({ farkle }) => {
  const [legendVisible, setLegendVisible] = useState(true)

  const ruleOrder = ['single1', 'single5', 'three1', 'three2', 'three3', 'three4', 'three5', 'three6', 'fourOfAKind', 'fiveOfAKind', 'sixOfAKind', 'straight', 'threePairs', 'fourOfAKindAndPair', 'twoTriplets']
  const enabledRules = ruleOrder.filter(key => farkle.rules[key] > 0)
  const allEnabled = enabledRules.length === 15
  const rows = allEnabled ? 5 : 3
  const cols = 3
  const rules = allEnabled ? ruleOrder.map(key => ({ key, name: farkle.ruleNames[key], value: farkle.rules[key] })) : enabledRules.map(key => ({ key, name: farkle.ruleNames[key], value: farkle.rules[key] }))
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null))
  for (let i = 0; i < rules.length; i++) {
    const col = Math.floor(i / rows)
    const row = i % rows
    grid[row][col] = rules[i]
  }
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
        <div>Goal: {farkle.winningScore}</div>
        {!farkle.hasBanked[farkle.currentPlayer] && <div>Min. Bank: {farkle.minBankScore}</div>}
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
            className={`die ${farkle.selectedDice.has(i) ? 'selected' : ''} ${farkle.disabledDice.has(i) ? 'disabled' : ''} ${die === null ? 'blank' : ''} ${farkle.isRolling && !farkle.disabledDice.has(i) ? 'rolling' : ''}`}
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
              <button onClick={farkle.rollDice} disabled={!farkle.canRoll || farkle.isRolling}>Roll</button>
              <button onClick={farkle.setAside} disabled={farkle.selectedDice.size === 0 || selectedScore === 0}>Set Aside</button>
              <button onClick={farkle.bankScore} disabled={farkle.turnScore === 0 || (!farkle.hasBanked[farkle.currentPlayer] && farkle.turnScore < farkle.minBankScore)}>Bank Score</button>
              <button onClick={() => farkle.setGameStarted(false)}>Exit Game</button>
              {!legendVisible && <button className="show-rules-btn" onClick={() => setLegendVisible(true)}>Show Rules</button>}
            </>
          )
        })()}
      </div>
      {legendVisible ? (
        <div className="legend">
          <div className="legend-header">
            <h3>Scoring Rules</h3>
            <button onClick={() => setLegendVisible(false)}>×</button>
          </div>
          <div className="legend-grid">
            {grid.flat().filter(rule => rule !== null).map((rule, i) => (
              <div key={i} className="legend-item">{rule ? <><strong>{rule.name}</strong>: {rule.value}</> : ''}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Game