import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import validGuesses from '../words.txt';
import Confetti from 'react-confetti'

const letterlist = "abcdefghijklmnopqrstuvwxyz"
const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]
]

export const Game = () => {
  const [guess, _setGuess] = useState([null, null, null, null, null]);
  const [shakeRow, setShakeRow] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [previousGuesses, _setPreviousGuesses] = useState([]);
  const answers = useRef([]);
  const answer = useRef([]);

  const guessRef = useRef(guess);
  const previousGuessesRef = useRef(previousGuesses);

  const setPreviousGuesses = data => {
    previousGuessesRef.current = data;
    _setPreviousGuesses(data);
  }

  const setGuess = data => {
    guessRef.current = data;
    _setGuess(data);
  }

  const setKey = useCallback((e) => {
    if (gameWon) {
      return;
    }
    let letter = e.key;
    let currentGuess = guessRef.current.filter(a => a);

    if (letterlist.indexOf(letter) >= 0 && currentGuess.length <= 4) {
      const newGuess = [...currentGuess, letter, ...Array(4 - currentGuess.length || 0).fill(null)]
      setGuess(newGuess)
      return
    }
    if (letter === 'Backspace') {
      const newGuess = [...currentGuess];
      newGuess.pop()
      setGuess([...newGuess, ...Array(5 - newGuess.length || 0).fill(null)])
      return
    }
    if (letter === 'Enter') {
      let wordFound = answers.current.find(a => a === currentGuess.join(''))

      if (wordFound) {
        let guessInfo = [];
        currentGuess.map((letter, i) => {
          let letterGreen = answer.current.toLowerCase()[i] === letter

          guessInfo.push({
            letter,
            found: letterGreen
          })
        })

        guessInfo = guessInfo.map((guessLetter, i) => {
          let totalNumberInWord = answer.current.split(guessLetter.letter).length - 1
          let accountedFor = guessInfo.slice(0, i).filter(a => a.letter === guessLetter.letter).length
          let greenLater = guessInfo.slice(i, guessInfo.length).filter(a => (a.letter === guessLetter.letter && a.found)).length > 0
          let letterYellow = totalNumberInWord > accountedFor && !greenLater && answer.current.toLowerCase().indexOf(guessLetter.letter) >= 0
          guessLetter.found = guessLetter.found ? "letter-green" : (letterYellow ? "letter-yellow" : "letter-red")

          return guessLetter
        })

        setPreviousGuesses([...previousGuessesRef.current, guessInfo])
        setGuess([null, null, null, null, null])
        let gameIsWon = guessInfo.every(a => a.found === "letter-green")
        setGameWon(gameIsWon);
      } else {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 200)
      }
    }
  }, [guessRef, gameWon])

  const decideKeyClass = (key) => {
    let letterColors = {};

    for (const prevGuess of previousGuesses) {
      for (const letter of prevGuess) {
        if (letter.letter === key) {
          letterColors[key] ? letterColors[key].push(letter.found) : letterColors[key] = [letter.found]
        }
      }
    }

    if (letterColors[key]?.some(letter => letter === "letter-green")) {
      return "letter-green"
    }

    if (letterColors[key]?.some(letter => letter === "letter-yellow")) {
      return "letter-yellow"
    }

    if (letterColors[key]?.some(letter => letter === "letter-red")) {
      return "letter-red"
    }

    return ""
  }

  useEffect(() => {
    window.addEventListener("keydown", setKey)
    fetch(validGuesses)
      .then(r => r.text())
      .then(text => {
        let validAnswers = text.split('\n')
        answers.current = validAnswers
        let randomAnswer = validAnswers[Math.floor(Math.random() * validAnswers.length)];
        console.log(randomAnswer)
        answer.current = randomAnswer
      });

    return () => {
      window.removeEventListener("keydown", setKey)
    }
  }, [setKey])

  useLayoutEffect(() => {
    let list = document.querySelectorAll('.previous-guesses')
    setTimeout(() => {
      list[list.length - 1]?.classList.add('flip')
    }, 10)
  })

  const letterBox = (j, previousGuesses, letter, i) => <div className={`letter-wrapper`} key={i}>
    <div className="letter-guess front">{letter.letter}</div>
    <div className={`letter-guess back ${letter.found}`}>{letter.letter}</div>
  </div>

  return <div style={{ width: "100%" }}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="game-icon" data-testid="icon-statistics"><path fill="var(--color-tone-1)" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path></svg>
    <div className="keyboard-wrapper">
      {previousGuesses.map((prevGuess, j) => {
        return <div className="game-row previous-guesses" key={j}>{prevGuess.map((letter, i) => {
          return letterBox(j, previousGuesses, letter, i)
        })}
        </div>
      })}

      {previousGuesses.length < 6 &&
        <div className={`game-row ${shakeRow ? "shake-row" : null}`}>
          {guess.map((l, i) => {
            return <div className={`letter-guess ${l ? "letter-filled" : null}`} key={i}>{l}</div>
          })}
        </div>
      }

      {previousGuesses.length < 6 && Array(Math.max((5 - previousGuesses.length), 0)).fill(null).map((prevGuess, j) => {
        return <div className="game-row" key={j}>{Array(5).fill(null).map((letter, i) => {
          return <div className={`letter-guess`} key={i}></div>
        })}
        </div>
      })}
      {!gameWon && previousGuesses.length >= 6 && <div>You lose, the word was {answer.current}</div>}
      {gameWon && <div> 
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
        {Math.random() > 0.05 ? "win" :  "Can't believe you didn't guess it sooner, it was so obvious!"}</div>}
    </div>

    <div className="keyboard-wrapper a">
      {keyboard.map((row, j) => {
        return <div className="keyboard-row" key={j}>{row.map((letter, i) => <div onClick={() => setKey({ key: letter })} style={{ width: letter === "Backspace" || letter === "Enter" ? "100px" : "50px" }} className={`keyboard-key ${decideKeyClass(letter)}`} key={i}>{letter === "Backspace" ? "␈" : letter}</div>)}</div>
      })}
    </div>
  </div>

} 