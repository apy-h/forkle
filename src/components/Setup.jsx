import React from 'react'

const Setup = ({ farkle }) => {
  const allZero = Object.values(farkle.rules).every(v => v === 0)

  const ruleOrder = ['single1', 'single5', 'three1', 'three2', 'three3', 'three4', 'three5', 'three6', 'fourOfAKind', 'fiveOfAKind', 'sixOfAKind', 'straight', 'threePairs', 'fourOfAKindAndPair', 'twoTriplets']

  const scoringRules = ruleOrder.map(key => ({
    key,
    name: farkle.ruleNames[key],
    value: farkle.rules[key],
    onChange: e => farkle.setRules({ ...farkle.rules, [key]: +e.target.value }),
    inputProps: { min: 0, max: farkle.winningScore }
  }))

  const cols = 3
  const rows = 5
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null))
  for (let i = 0; i < scoringRules.length; i++) {
    const col = Math.floor(i / rows)
    const row = i % rows
    grid[row][col] = scoringRules[i]
  }

  const allItems = [
    { key: 'goal', name: 'Goal', value: farkle.winningScore, onChange: e => farkle.setWinningScore(+e.target.value), inputProps: { min: 1 } },
    { key: 'minBank', name: 'Min. score to bank on 1st turn', value: farkle.minBankScore, onChange: e => farkle.setMinBankScore(+e.target.value), inputProps: { min: 0, max: farkle.winningScore } },
    ...scoringRules
  ]

  return (
    <div className="app">
      <h1>Farkle - Setup Rules</h1>

      {/* Top table */}
      <div className="rules-table top-table">
        <div className="rules-row">
          <label>{allItems[0].name}: <input type="number" {...allItems[0].inputProps} value={allItems[0].value} onChange={allItems[0].onChange} /></label>
          <label>{allItems[1].name}: <input type="number" {...allItems[1].inputProps} value={allItems[1].value} onChange={allItems[1].onChange} /></label>
        </div>
      </div>

      {/* Bottom table */}
      <div className="rules-table bottom-table">
        {grid.map((row, r) => (
          <div key={r} className="rules-row">
            {row.map((rule, c) => (
              <label key={c}>{rule.name}: <input type="number" {...rule.inputProps} value={rule.value} onChange={rule.onChange} /></label>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile single column layout */}
      <div className="mobile-rules">
        {allItems.map(item => (
          <label key={item.key}>{item.name}: <input type="number" {...item.inputProps} value={item.value} onChange={item.onChange} /></label>
        ))}
      </div>

      {allZero && <p>At least one scoring rule must be greater than 0.</p>}
      <div className="setup-buttons">
        <button onClick={() => farkle.setGameStarted(true)} disabled={allZero}>Start Game</button>
        <button onClick={farkle.resetToDefaults}>Reset Rules</button>
      </div>
    </div>
  )
}

export default Setup