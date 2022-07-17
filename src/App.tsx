import './App.scss';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import StatsModal from './components/StatsModal';
import Nav from './components/Nav';
import { save, retrieve, remove } from './storage/localStorage';
import {
  updateStats,
  initialStats,
  initialGuessDistribution,
} from './utils/stats-utils';
import { emptyBoard } from './utils/board-utils';
import validGuesses from './words.txt';

function App() {
  const [showStats, setShowStats] = useState(false);
  const [stats, _setStats] = useState(initialStats);
  const [guessDistribution, setGuessDistribution] = useState(
    initialGuessDistribution
  );
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [gameBoard, _setGameBoard] = useState(emptyBoard);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toggleWord, setToggleWord] = useState(true);

  const setStats = (result) => {
    let updatedStats = updateStats(stats, !!result);

    if (typeof result === 'number') {
      let newGuessDistribution = [...guessDistribution];
      newGuessDistribution[result] = newGuessDistribution[result] + 1;
      save('guessDistribution', newGuessDistribution);
      setGuessDistribution(newGuessDistribution);
    }

    save('stats', updatedStats);
    _setStats(updatedStats);
    setShowStats(true);
  };

  const resetBoard = () => {
    remove('answer');
    remove('gameBoard');
    _setGameBoard(emptyBoard);
    setGameOver(false);
    setGameWon(false);
    setShowStats(false);
    setToggleWord(!toggleWord);
  };

  useEffect(() => {
    const stats = retrieve('stats');
    if (stats) {
      _setStats(stats);
    }

    const distribution = retrieve('guessDistribution');
    if (distribution) {
      setGuessDistribution(distribution);
    }

    const storedGameBoard = retrieve('gameBoard');
    if (storedGameBoard) {
      _setGameBoard(storedGameBoard);
    }

    fetch(validGuesses)
      .then((r) => r.text())
      .then((text) => {
        const validAnswers = text.split('\n');
        setAnswers(validAnswers);
        const randomAnswer =
          validAnswers[Math.floor(Math.random() * validAnswers.length)];

        const answerWord = retrieve('answer');
        if (answerWord) {
          setAnswer(answerWord);
        } else {
          setAnswer(randomAnswer);
          save('answer', randomAnswer);
        }
      });
  }, [toggleWord]);

  console.log(answer);
  return (
    <div className="App">
      <Nav openStats={() => setShowStats(true)} />
      <Game
        setStats={setStats}
        answers={answers}
        answer={answer}
        gameBoard={gameBoard}
        setGameBoard={_setGameBoard}
        gameWon={gameWon}
        setGameWon={setGameWon}
        gameOver={gameOver}
        setGameOver={setGameOver}
      />
      <StatsModal
        showStats={showStats}
        distribution={guessDistribution}
        stats={stats}
        closeModal={() => setShowStats(false)}
        resetBoard={resetBoard}
      />
    </div>
  );
}

export default App;
