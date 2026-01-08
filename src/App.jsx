import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 }
  ])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [canRoll, setCanRoll] = useState(true)
  const [turnScore, setTurnScore] = useState(0)
  const [hasBanked, setHasBanked] = useState([false, false])

  const [dice, setDice] = useState([null, null, null, null, null, null])
  const [selectedDice, setSelectedDice] = useState(new Set())
  const [setAsideDice, setSetAsideDice] = useState([])
  const [disabledDice, setDisabledDice] = useState(new Set())

  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState('')
  const [message, setMessage] = useState('')

  const [rules, setRules] = useState({
    single1: 100,
    single5: 50,
    three1: 300,
    three2: 200,
    three3: 300,
    three4: 400,
    three5: 500,
    three6: 600,
    fourOfAKind: 1000,
    fiveOfAKind: 2000,
    sixOfAKind: 3000,
    straight: 1500,
    threePairs: 1500,
    fourOfAKindAndPair: 1500,
    twoTriplets: 2500
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [farkleTriggered, setFarkleTriggered] = useState(false)

  const WINNING_SCORE = 10000

  // Calculate score from dice values
  const calculateScore = (diceValues) => {
    console.log('Calculating score for:', diceValues, 'rules:', rules)
    const counts = [0, 0, 0, 0, 0, 0, 0] // index 1-6
    for (let d of diceValues) {
      counts[d]++
    }

    // Collect all applicable full combinations and their scores
    const fullCombinations = []

    // Straight
    if (counts.slice(1).every(c => c === 1)) {
      fullCombinations.push({ score: rules.straight, rule: 'Straight (1-6)' })
    }

    const pairNums = []
    const tripletNums = []
    let fourNum = -1

    for (let num = 1; num <= 6; num++) {
      if (counts[num] >= 2) pairNums.push(num)
      if (counts[num] >= 3) tripletNums.push(num)
      if (counts[num] >= 4) fourNum = num
    }

    // Three pairs
    if (pairNums.length === 3) {
      fullCombinations.push({ score: rules.threePairs, rule: `Three pairs (${pairNums.join('s, ')}s)` })
    }

    // Two triplets
    if (tripletNums.length === 2) {
      fullCombinations.push({ score: rules.twoTriplets, rule: `Two triplets (${tripletNums[0]}s and ${tripletNums[1]}s)` })
    }

    // Four of a kind and pair
    if (fourNum !== -1 && pairNums.length === 2) {
      fullCombinations.push({ score: rules.fourOfAKindAndPair, rule: `Four ${fourNum}s and a pair of ${pairNums.filter(num => num !== fourNum)[0]}s` })
    }

    // Find the highest scoring full combination
    let maxFull = { score: 0, rule: '' }
    for (let combo of fullCombinations) {
      if (combo.score > maxFull.score) {
        maxFull = combo
      }
    }

    if (maxFull.score > 0) {
      return maxFull
    }

    // If no full combination, try multiples and singles, but must use all dice
    let score = 0
    let rule = ''

    // Check multiples (highest first)
    for (let num = 1; num <= 6; num++) {
      if (counts[num] >= 6) {
        score += rules.sixOfAKind
        rule = `Six ${num}s`
        counts[num] -= 6
      } else if (counts[num] >= 5) {
        score += rules.fiveOfAKind
        rule = `Five ${num}s`
        counts[num] -= 5
      } else if (counts[num] >= 4) {
        score += rules.fourOfAKind
        rule = `Four ${num}s`
        counts[num] -= 4
      } else if (counts[num] >= 3) {
        score += num === 1 ? rules.three1 : rules[`three${num}`]
        rule = `Three ${num}s`
        counts[num] -= 3
      }
    }

    // Score remaining singles
    let singlesScore = counts[1] * rules.single1 + counts[5] * rules.single5
    if (singlesScore > 0) {
      score += singlesScore
      let singlesDesc = []
      if (counts[1] > 0) singlesDesc.push(`${counts[1]} x 1`)
      if (counts[5] > 0) singlesDesc.push(`${counts[5]} x 5`)
      let singlesStr = `Singles (${singlesDesc.join(', ')})`
      if (rule) {
        rule += ` and ${singlesStr}`
      } else {
        rule = singlesStr
      }
      counts[1] = 0
      counts[5] = 0
    }

    // Check if all dice are scored
    const remaining = counts.slice(1).some(c => c > 0)
    if (remaining) {
      console.log('Remaining dice not scored, score 0')
      return { score: 0, rule: '' }
    }

    console.log('Final score:', score, 'rule:', rule)
    return { score, rule }
  }

  // Check if dice have any scoring possibility
  const hasScoring = (diceValues) => {
    const counts = [0, 0, 0, 0, 0, 0, 0]
    for (let d of diceValues) {
      counts[d]++
    }
    // Check for 1 or 5
    if (counts[1] > 0 || counts[5] > 0) return true
    // Check for triplets
    for (let num = 1; num <= 6; num++) {
      if (counts[num] >= 3) return true
    }
    // Check for three pairs
    let pairs = 0
    for (let num = 1; num <= 6; num++) {
      if (counts[num] >= 2) pairs++
    }
    if (pairs >= 3) return true

    return false
  }

  // Roll dice
  const rollDice = () => {
    if (!canRoll) return
    const newDice = [...dice]
    const toRoll = []
    for (let i = 0; i < 6; i++) {
      if (!disabledDice.has(i)) toRoll.push(i)
    }
    if (toRoll.length === 0) return
    for (let i of toRoll) {
      newDice[i] = Math.floor(Math.random() * 6) + 1
    }
    setDice(newDice)
    setSelectedDice(new Set())
    setCanRoll(false)
  }

  // Select/deselect die
  const selectDie = (index) => {
    if (disabledDice.has(index) || dice[index] === null) return
    const newSelected = new Set(selectedDice)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedDice(newSelected)
  }

  // Set aside
  const setAside = () => {
    if (selectedDice.size === 0) return
    const selectedValues = Array.from(selectedDice).map(i => dice[i])
    const { score, rule } = calculateScore(selectedValues)
    if (score === 0) {
      setMessage('No scoring dice selected!')
      return
    }
    setTurnScore(turnScore + score)
    const newSetAside = { indices: new Set(selectedDice), score, rule }
    setSetAsideDice([...setAsideDice, newSetAside])
    const newDisabled = new Set(disabledDice)
    for (let i of selectedDice) newDisabled.add(i)
    setDisabledDice(newDisabled)
    setSelectedDice(new Set())
    const remaining = 6 - newDisabled.size
    if (remaining === 0) {
      setMessage('Hot dice! Roll all again.')
      setCanRoll(true)
      setDice([null, null, null, null, null, null])
      setDisabledDice(new Set())
    } else {
      setCanRoll(true)
      setMessage('')
    }
  }

  // Bank score
  const bankScore = () => {
    if (!hasBanked[currentPlayer] && turnScore < 500) {
      setMessage('Must score at least 500 to bank on first turn!')
      return
    }
    const newPlayers = [...players]
    newPlayers[currentPlayer].score += turnScore
    setPlayers(newPlayers)
    const newHasBanked = [...hasBanked]
    newHasBanked[currentPlayer] = true
    setHasBanked(newHasBanked)
    if (newPlayers[currentPlayer].score >= WINNING_SCORE) {
      setGameOver(true)
      setWinner(newPlayers[currentPlayer].name)
    } else {
      nextPlayer()
    }
  }

  // Next player
  const nextPlayer = () => {
    setCurrentPlayer((currentPlayer + 1) % 2)
    setTurnScore(0)
    setSelectedDice(new Set())
    setSetAsideDice([])
    setDisabledDice(new Set())
    setCanRoll(true)
    setDice([null, null, null, null, null, null])
    setMessage('')
    setFarkleTriggered(false)
  }

  // Check for farkle
  useEffect(() => {
    if (!canRoll) {
      const remainingValues = []
      for (let i = 0; i < 6; i++) {
        if (!disabledDice.has(i) && dice[i] !== null) {
          remainingValues.push(dice[i])
        }
      }
      if (remainingValues.length > 0) {
        const hasScore = hasScoring(remainingValues)
        console.log('Remaining dice:', remainingValues, 'Has scoring:', hasScore)
        if (!hasScore && !farkleTriggered) {
          setMessage('Farkle!')
          setFarkleTriggered(true)
          setTimeout(() => nextPlayer(), 2000)
        }
      }
    }
  }, [dice, disabledDice, canRoll, farkleTriggered])

  // Reset game
  const resetGame = () => {
    setPlayers([
      { name: 'Player 1', score: 0 },
      { name: 'Player 2', score: 0 }
    ])
    setHasBanked([false, false])
    setCurrentPlayer(0)
    setDice([null, null, null, null, null, null])
    setSelectedDice(new Set())
    setSetAsideDice([])
    setDisabledDice(new Set())
    setCanRoll(true)
    setTurnScore(0)
    setGameOver(false)
    setWinner('')
    setMessage('')
    setFarkleTriggered(false)
    setGameStarted(false)
  }

  if (!gameStarted) {
    return (
      <div className="app">
        <h1>Farkle - Setup Rules</h1>
        <div className="rules-form">
          <label>Single 1: <input type="number" value={rules.single1} onChange={e => setRules({...rules, single1: +e.target.value})} /></label>
          <label>Single 5: <input type="number" value={rules.single5} onChange={e => setRules({...rules, single5: +e.target.value})} /></label>
          <label>Three 1s: <input type="number" value={rules.three1} onChange={e => setRules({...rules, three1: +e.target.value})} /></label>
          <label>Three 2s: <input type="number" value={rules.three2} onChange={e => setRules({...rules, three2: +e.target.value})} /></label>
          <label>Three 3s: <input type="number" value={rules.three3} onChange={e => setRules({...rules, three3: +e.target.value})} /></label>
          <label>Three 4s: <input type="number" value={rules.three4} onChange={e => setRules({...rules, three4: +e.target.value})} /></label>
          <label>Three 5s: <input type="number" value={rules.three5} onChange={e => setRules({...rules, three5: +e.target.value})} /></label>
          <label>Three 6s: <input type="number" value={rules.three6} onChange={e => setRules({...rules, three6: +e.target.value})} /></label>
          <label>Four of a kind: <input type="number" value={rules.fourOfAKind} onChange={e => setRules({...rules, fourOfAKind: +e.target.value})} /></label>
          <label>Five of a kind: <input type="number" value={rules.fiveOfAKind} onChange={e => setRules({...rules, fiveOfAKind: +e.target.value})} /></label>
          <label>Six of a kind: <input type="number" value={rules.sixOfAKind} onChange={e => setRules({...rules, sixOfAKind: +e.target.value})} /></label>
          <label>Straight (1-6): <input type="number" value={rules.straight} onChange={e => setRules({...rules, straight: +e.target.value})} /></label>
          <label>Three pairs: <input type="number" value={rules.threePairs} onChange={e => setRules({...rules, threePairs: +e.target.value})} /></label>
          <label>Four of a kind and a pair: <input type="number" value={rules.fourOfAKindAndPair} onChange={e => setRules({...rules, fourOfAKindAndPair: +e.target.value})} /></label>
          <label>Two triplets: <input type="number" value={rules.twoTriplets} onChange={e => setRules({...rules, twoTriplets: +e.target.value})} /></label>
        </div>
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="app">
        <h1>Farkle</h1>
        <h2>{winner} wins!</h2>
        <button onClick={resetGame}>New Game</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Farkle</h1>
      <div className="scores">
        {players.map((player, i) => (
          <div key={i} className={i === currentPlayer ? 'current' : ''}>
            {player.name}: {player.score}
          </div>
        ))}
      </div>
      <div className="turn">
        <p>Turn Score: {turnScore}</p>
        <p>{message}</p>
      </div>
      <div className="set-aside">
        {setAsideDice.map((aside, idx) => (
          <div key={idx} className="aside-group">
            <div className="aside-dice">
              {Array.from(aside.indices).map(i => <span key={i} className="aside-die">{dice[i]}</span>)}
            </div>
            <div>{aside.rule}: {aside.score}</div>
          </div>
        ))}
      </div>
      <div className="dice">
        {dice.map((die, i) => (
          <div
            key={i}
            className={`die ${selectedDice.has(i) ? 'selected' : ''} ${disabledDice.has(i) ? 'disabled' : ''} ${die === null ? 'blank' : ''}`}
            onClick={() => selectDie(i)}
          >
            {die || ''}
          </div>
        ))}
      </div>
      <div className="buttons">
        {(() => {
          const selectedValues = Array.from(selectedDice).map(i => dice[i])
          const selectedScore = calculateScore(selectedValues).score
          console.log('Selected values:', selectedValues, 'Score:', selectedScore)
          return (
            <>
              <button onClick={rollDice} disabled={!canRoll}>Roll</button>
              <button onClick={setAside} disabled={selectedDice.size === 0 || selectedScore === 0}>Set Aside</button>
              <button onClick={bankScore} disabled={turnScore === 0 || (!hasBanked[currentPlayer] && turnScore < 500)}>Bank Score</button>
            </>
          )
        })()}
      </div>
      <div className="legend">
        <h3>Scoring Rules</h3>
        <ul>
          <li>Single 1: {rules.single1}</li>
          <li>Single 5: {rules.single5}</li>
          <li>Three 1s: {rules.three1}</li>
          <li>Three 2s: {rules.three2}</li>
          <li>Three 3s: {rules.three3}</li>
          <li>Three 4s: {rules.three4}</li>
          <li>Three 5s: {rules.three5}</li>
          <li>Three 6s: {rules.three6}</li>
          <li>Four of a kind: {rules.fourOfAKind}</li>
          <li>Five of a kind: {rules.fiveOfAKind}</li>
          <li>Six of a kind: {rules.sixOfAKind}</li>
          <li>Straight (1-6): {rules.straight}</li>
          <li>Three pairs: {rules.threePairs}</li>
          <li>Four of a kind and a pair: {rules.fourOfAKindAndPair}</li>
          <li>Two triplets: {rules.twoTriplets}</li>
        </ul>
      </div>
    </div>
  )
}

export default App