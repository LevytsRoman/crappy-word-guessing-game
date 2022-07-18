import './App.scss';
import { useEffect, useState } from 'react';
import Game from './components/Game';
import StatsModal from './components/StatsModal';
import SettingsModal, { SettingsType } from './components/SettingsModal';
import Nav from './components/Nav';
import { save, retrieve, remove } from './storage/localStorage';
import {
  updateStats,
  initialStats,
  dateToday,
  initialGuessDistribution,
} from './utils/stats-utils';
import { emptyBoard } from './utils/board-utils';
import validGuesses from './words.txt';
import { GREEN } from './components/constants';
import Confetti from 'react-confetti';

function App() {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, _setSettings] = useState({ hardMode: false });
  const [stats, _setStats] = useState({});
  const [guessDistribution, setGuessDistribution] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [gameBoard, setGameBoard] = useState(emptyBoard);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [toggleWord, setToggleWord] = useState(true);

  const setStats = (result) => {
    let updatedStats = updateStats(
      stats[dateToday()] || initialStats,
      typeof result === 'number'
    );

    if (typeof result === 'number') {
      let newGuessDistribution = [
        ...(guessDistribution[dateToday()] || initialGuessDistribution),
      ];
      newGuessDistribution[result] = newGuessDistribution[result] + 1;
      save('guessDistribution', {
        ...guessDistribution,
        [dateToday()]: newGuessDistribution,
      });
      setGuessDistribution({
        ...guessDistribution,
        [dateToday()]: newGuessDistribution,
      });
      setGameWon(true);
    } else {
      setGameOver(true);
    }

    save('stats', { ...stats, [dateToday()]: updatedStats });
    _setStats({ ...stats, [dateToday()]: updatedStats });
    setShowStats(true);
  };

  const setSettings = (settings) => {
    _setSettings(settings);
    save('settings', settings);
  };

  const resetBoard = () => {
    remove('answer');
    remove('gameBoard');
    setGameBoard(emptyBoard);
    setGameOver(false);
    setGameWon(false);
    setShowStats(false);
    setToggleWord(!toggleWord);
  };

  useEffect(() => {
    const stats = retrieve('stats');
    if (stats && stats[dateToday()]) {
      _setStats(stats);
    } else {
      _setStats({ ...stats, [dateToday()]: initialStats });
    }

    const distribution = retrieve('guessDistribution');
    if (distribution && distribution[dateToday()]) {
      setGuessDistribution(distribution);
    } else {
      setGuessDistribution({
        ...distribution,
        [dateToday()]: initialGuessDistribution,
      });
    }

    const storedGameBoard = retrieve('gameBoard');
    if (storedGameBoard) {
      setGameBoard(storedGameBoard);
      if (
        storedGameBoard.find((row) =>
          row.every((letter) => letter.color === GREEN)
        )
      ) {
        setGameWon(true);
      }
      if (storedGameBoard.every((row) => row.every((letter) => letter.color))) {
        setGameOver(true);
      }
    }

    const storedSettings = retrieve('settings');

    if (storedSettings) {
      _setSettings(storedSettings);
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
      <Nav
        openSettings={() => setShowSettings(true)}
        openStats={() => setShowStats(true)}
      />
      <Game
        setStats={setStats}
        answers={answers}
        answer={answer}
        gameBoard={gameBoard}
        setGameBoard={setGameBoard}
        gameWon={gameWon}
        gameOver={gameOver}
        hardMode={settings.hardMode}
        resetBoard={resetBoard}
      />
      {showStats && (
        <StatsModal
          showStats={showStats}
          gameWon={gameWon}
          answer={answer}
          gameOver={gameOver}
          distribution={guessDistribution}
          stats={stats}
          closeModal={() => setShowStats(false)}
          resetBoard={resetBoard}
        />
      )}
      <SettingsModal
        showSettings={showSettings}
        settings={settings}
        setSettings={setSettings}
        closeModal={() => setShowSettings(false)}
      />

      {gameWon && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
    </div>
  );
}

export default App;
