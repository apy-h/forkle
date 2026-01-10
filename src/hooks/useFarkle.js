import { useState, useEffect } from 'react'

const FLASH_INTERVAL_MS = 300
const ROLL_DURATION_MS = 900

// Set CSS custom property for animation duration
document.documentElement.style.setProperty('--flash-duration', `${FLASH_INTERVAL_MS / 1000}s`)

const useFarkle = () => {
  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 }
  ])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [canRoll, setCanRoll] = useState(true)
  const [turnScore, setTurnScore] = useState(0)
  const [hasBanked, setHasBanked] = useState([false, false])

  const [dice, setDice] = useState([null, null, null, null, null, null])
  const [isRolling, setIsRolling] = useState(false)
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
  const [winningScore, setWinningScore] = useState(10000)
  const [minBankScore, setMinBankScore] = useState(500)

  // Rule display names for legend
  const ruleNames = {
    single1: 'Single 1',
    single5: 'Single 5',
    three1: 'Three 1s',
    three2: 'Three 2s',
    three3: 'Three 3s',
    three4: 'Three 4s',
    three5: 'Three 5s',
    three6: 'Three 6s',
    fourOfAKind: 'Four-of-a-kind',
    fiveOfAKind: 'Five-of-a-kind',
    sixOfAKind: 'Six-of-a-kind',
    straight: 'Straight (1-6)',
    threePairs: 'Three pairs',
    fourOfAKindAndPair: 'Four-of-a-kind & pair',
    twoTriplets: 'Two triplets'
  }

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

  // Check if dice have any scoring possibility based on active rules, in order
  const hasScoring = (diceValues) => {
    const counts = [0, 0, 0, 0, 0, 0, 0]
    for (let d of diceValues) {
      counts[d]++
    }

    // Check rules in order
    if (rules.single1 > 0 && counts[1] > 0) return true
    if (rules.single5 > 0 && counts[5] > 0) return true
    if (rules.three1 > 0 && counts[1] >= 3) return true
    if (rules.three2 > 0 && counts[2] >= 3) return true
    if (rules.three3 > 0 && counts[3] >= 3) return true
    if (rules.three4 > 0 && counts[4] >= 3) return true
    if (rules.three5 > 0 && counts[5] >= 3) return true
    if (rules.three6 > 0 && counts[6] >= 3) return true
    if (rules.fourOfAKind > 0 && counts.some(c => c >= 4)) return true
    if (rules.fiveOfAKind > 0 && counts.some(c => c >= 5)) return true
    if (rules.sixOfAKind > 0 && counts.some(c => c >= 6)) return true
    if (rules.straight > 0 && counts.slice(1).every(c => c === 1)) return true
    if (rules.threePairs > 0) {
      let pairs = 0
      for (let num = 1; num <= 6; num++) {
        if (counts[num] >= 2) pairs++
      }
      if (pairs >= 3) return true
    }
    if (rules.fourOfAKindAndPair > 0) {
      let four = -1
      for (let num = 1; num <= 6; num++) {
        if (counts[num] >= 4) four = num
      }
      if (four !== -1) return true
    }
    if (rules.twoTriplets > 0) {
      let triplets = 0
      for (let num = 1; num <= 6; num++) {
        if (counts[num] >= 3) triplets++
      }
      if (triplets >= 2) return true
    }
    return false
  }

  // Roll dice
  const rollDice = () => {
    if (!canRoll) return
    setIsRolling(true)
    const toRoll = []
    for (let i = 0; i < 6; i++) {
      if (!disabledDice.has(i)) toRoll.push(i)
    }
    if (toRoll.length === 0) {
      setIsRolling(false)
      return
    }

    // Start flashing animation
    const interval = setInterval(() => {
      const tempDice = [...dice]
      for (let i of toRoll) {
        tempDice[i] = Math.floor(Math.random() * 6) + 1
      }
      setDice(tempDice)
    }, FLASH_INTERVAL_MS)

    // Stop animation and set final values
    setTimeout(() => {
      clearInterval(interval)
      const newDice = [...dice]
      for (let i of toRoll) {
        newDice[i] = Math.floor(Math.random() * 6) + 1
      }
      setDice(newDice)
      setSelectedDice(new Set())
      setCanRoll(false)
      setIsRolling(false)
    }, ROLL_DURATION_MS) // Match animation duration
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
    if (!hasBanked[currentPlayer] && turnScore < minBankScore) {
      setMessage(`Must score at least ${minBankScore} to bank on first turn!`)
      return
    }
    const newPlayers = [...players]
    newPlayers[currentPlayer].score += turnScore
    setPlayers(newPlayers)
    const newHasBanked = [...hasBanked]
    newHasBanked[currentPlayer] = true
    setHasBanked(newHasBanked)
    if (newPlayers[currentPlayer].score >= winningScore) {
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

  // Reset to defaults
  const resetToDefaults = () => {
    setWinningScore(10000)
    setMinBankScore(500)
    setRules({
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
  }

  return {
    players,
    currentPlayer,
    canRoll,
    turnScore,
    hasBanked,
    dice,
    selectedDice,
    setAsideDice,
    disabledDice,
    gameOver,
    winner,
    message,
    rules,
    gameStarted,
    farkleTriggered,
    winningScore,
    minBankScore,
    ruleNames,
    isRolling,
    calculateScore,
    hasScoring,
    rollDice,
    selectDie,
    setAside,
    bankScore,
    nextPlayer,
    resetGame,
    resetToDefaults,
    setGameStarted,
    setMessage,
    setFarkleTriggered,
    setRules,
    setWinningScore,
    setMinBankScore
  }
}

export default useFarkle