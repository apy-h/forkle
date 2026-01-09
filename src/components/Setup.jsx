import React from 'react'

const Setup = ({ farkle }) => {
  const allZero = Object.values(farkle.rules).every(v => v === 0)
  return (
    <div className="app">
      <h1>Farkle - Setup Rules</h1>

      {/* Top table */}
      <div className="rules-table top-table">
        <div className="rules-row">
          <label>Goal: <input type="number" min="1" value={farkle.winningScore} onChange={e => farkle.setWinningScore(+e.target.value)} /></label>
          <label>Min. score to bank on 1st turn: <input type="number" min="0" max={farkle.winningScore} value={farkle.minBankScore} onChange={e => farkle.setMinBankScore(+e.target.value)} /></label>
        </div>
      </div>

      {/* Bottom table */}
      <div className="rules-table bottom-table">
        <div className="rules-row">
          <label>Single 1: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.single1} onChange={e => farkle.setRules({...farkle.rules, single1: +e.target.value})} /></label>
          <label>Three 2s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three2} onChange={e => farkle.setRules({...farkle.rules, three2: +e.target.value})} /></label>
          <label>Six-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.sixOfAKind} onChange={e => farkle.setRules({...farkle.rules, sixOfAKind: +e.target.value})} /></label>
        </div>
        <div className="rules-row">
          <label>Single 5: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.single5} onChange={e => farkle.setRules({...farkle.rules, single5: +e.target.value})} /></label>
          <label>Three 3s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three3} onChange={e => farkle.setRules({...farkle.rules, three3: +e.target.value})} /></label>
          <label>Straight (1-6): <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.straight} onChange={e => farkle.setRules({...farkle.rules, straight: +e.target.value})} /></label>
        </div>
        <div className="rules-row">
          <label>Three 1s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three1} onChange={e => farkle.setRules({...farkle.rules, three1: +e.target.value})} /></label>
          <label>Three 4s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three4} onChange={e => farkle.setRules({...farkle.rules, three4: +e.target.value})} /></label>
          <label>Three pairs: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.threePairs} onChange={e => farkle.setRules({...farkle.rules, threePairs: +e.target.value})} /></label>
        </div>
        <div className="rules-row">
          <label>Four-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fourOfAKind} onChange={e => farkle.setRules({...farkle.rules, fourOfAKind: +e.target.value})} /></label>
          <label>Three 5s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three5} onChange={e => farkle.setRules({...farkle.rules, three5: +e.target.value})} /></label>
          <label>Four-of-a-kind & pair: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fourOfAKindAndPair} onChange={e => farkle.setRules({...farkle.rules, fourOfAKindAndPair: +e.target.value})} /></label>
        </div>
        <div className="rules-row">
          <label>Five-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fiveOfAKind} onChange={e => farkle.setRules({...farkle.rules, fiveOfAKind: +e.target.value})} /></label>
          <label>Three 6s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three6} onChange={e => farkle.setRules({...farkle.rules, three6: +e.target.value})} /></label>
          <label>Two triplets: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.twoTriplets} onChange={e => farkle.setRules({...farkle.rules, twoTriplets: +e.target.value})} /></label>
        </div>
      </div>

      {/* Mobile single column layout */}
      <div className="mobile-rules">
        <label>Goal: <input type="number" min="1" value={farkle.winningScore} onChange={e => farkle.setWinningScore(+e.target.value)} /></label>
        <label>Min. score to bank on 1st turn: <input type="number" min="0" max={farkle.winningScore} value={farkle.minBankScore} onChange={e => farkle.setMinBankScore(+e.target.value)} /></label>
        <label>Single 1: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.single1} onChange={e => farkle.setRules({...farkle.rules, single1: +e.target.value})} /></label>
        <label>Single 5: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.single5} onChange={e => farkle.setRules({...farkle.rules, single5: +e.target.value})} /></label>
        <label>Three 1s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three1} onChange={e => farkle.setRules({...farkle.rules, three1: +e.target.value})} /></label>
        <label>Three 2s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three2} onChange={e => farkle.setRules({...farkle.rules, three2: +e.target.value})} /></label>
        <label>Three 3s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three3} onChange={e => farkle.setRules({...farkle.rules, three3: +e.target.value})} /></label>
        <label>Three 4s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three4} onChange={e => farkle.setRules({...farkle.rules, three4: +e.target.value})} /></label>
        <label>Three 5s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three5} onChange={e => farkle.setRules({...farkle.rules, three5: +e.target.value})} /></label>
        <label>Three 6s: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.three6} onChange={e => farkle.setRules({...farkle.rules, three6: +e.target.value})} /></label>
        <label>Four-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fourOfAKind} onChange={e => farkle.setRules({...farkle.rules, fourOfAKind: +e.target.value})} /></label>
        <label>Five-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fiveOfAKind} onChange={e => farkle.setRules({...farkle.rules, fiveOfAKind: +e.target.value})} /></label>
        <label>Six-of-a-kind: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.sixOfAKind} onChange={e => farkle.setRules({...farkle.rules, sixOfAKind: +e.target.value})} /></label>
        <label>Straight (1-6): <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.straight} onChange={e => farkle.setRules({...farkle.rules, straight: +e.target.value})} /></label>
        <label>Three pairs: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.threePairs} onChange={e => farkle.setRules({...farkle.rules, threePairs: +e.target.value})} /></label>
        <label>Four-of-a-kind & pair: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.fourOfAKindAndPair} onChange={e => farkle.setRules({...farkle.rules, fourOfAKindAndPair: +e.target.value})} /></label>
        <label>Two triplets: <input type="number" min="0" max={farkle.winningScore} value={farkle.rules.twoTriplets} onChange={e => farkle.setRules({...farkle.rules, twoTriplets: +e.target.value})} /></label>
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