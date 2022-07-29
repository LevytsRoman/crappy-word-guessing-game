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
import { emptyBoard, GameBoardType } from './utils/board-utils';
import validGuesses from './words.txt';
import sixLetterWords from './words6.txt';
import { GREEN } from './components/constants';
import Confetti from 'react-confetti';

function App() {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, _setSettings] = useState({ hardMode: false, wordLength: 5 });
  const [stats, _setStats] = useState({});
  const [guessDistribution, setGuessDistribution] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState(null);

  const [gameBoard, _setGameBoard] = useState<{ [key: number]: GameBoardType }>(
    {
      [settings.wordLength]: emptyBoard(6, settings.wordLength),
    }
  );

  const [toggleWord, setToggleWord] = useState(true);

  const setGameBoard = (newGameBoard) => {
    _setGameBoard({ ...gameBoard, [newGameBoard[0].length]: newGameBoard });
  };

  const setStats = (result) => {
    let updatedStats = updateStats(
      stats[dateToday()][settings.wordLength] || initialStats,
      typeof result === 'number'
    );

    if (typeof result === 'number') {
      let updatedGuessDistribution = [
        ...(guessDistribution[dateToday()][settings.wordLength] ||
          initialGuessDistribution(6)),
      ];
      updatedGuessDistribution[result] = updatedGuessDistribution[result] + 1;

      let newGuessDistribution = { ...guessDistribution };
      newGuessDistribution[dateToday()][settings.wordLength] =
        updatedGuessDistribution;
      save('guessDistribution', newGuessDistribution);

      setGuessDistribution(newGuessDistribution);
    }

    let newStats = { ...stats };
    newStats[dateToday()][settings.wordLength] = updatedStats;
    save('stats', newStats);
    _setStats(newStats);
    setTimeout(() => setShowStats(true), 1400);
  };

  const setSettings = (settings) => {
    _setSettings(settings);
    save('settings', settings);
    if (!gameBoard[settings.wordLength]) {
      setGameBoard(emptyBoard(6, settings.wordLength));
    }
  };

  const resetBoard = () => {
    remove('answer');
    remove('gameBoard');
    console.log(settings.wordLength);

    setGameBoard(emptyBoard(6, settings.wordLength));
    setShowStats(false);
    setToggleWord(!toggleWord);
  };

  useEffect(() => {
    const stats = retrieve('stats');
    if (stats && stats[dateToday()]) {
      // Migration of old stats to new one:

      let newStats = {};

      if (Object.keys(stats).find((date) => !stats[date][5])) {
        Object.keys(stats).map((key) => {
          newStats[key] = {
            [5]: stats[key],
          };
        });
      } else {
        newStats = stats;
      }

      _setStats(newStats);
    } else {
      let statsWithTodaysDate = {
        ...stats,
      };

      statsWithTodaysDate[dateToday()] = {
        ...statsWithTodaysDate[dateToday()],
        [settings.wordLength]: initialStats,
      };

      _setStats(statsWithTodaysDate);
    }

    const distribution = retrieve('guessDistribution');

    if (distribution && distribution[dateToday()]) {
      let newDistribution = {};
      if (Object.keys(distribution).find((date) => distribution[date].length)) {
        Object.keys(distribution).map((key) => {
          if (!distribution[key][5]) {
            newDistribution[key] = {
              [5]: distribution[key],
            };
          } else {
            newDistribution[key] = distribution[key];
          }
        });
        console.log({ newDistribution });
      } else {
        newDistribution = distribution;
      }

      setGuessDistribution(newDistribution);
    } else {
      let distributionWithTodaysDate = {
        ...distribution,
      };

      distributionWithTodaysDate[dateToday()] = {
        ...distributionWithTodaysDate[dateToday()],
        [settings.wordLength]: initialGuessDistribution(6),
      };

      setGuessDistribution(distributionWithTodaysDate);
    }

    const storedSettings = retrieve('settings');

    if (storedSettings) {
      _setSettings(storedSettings);
    }

    const storedGameBoard = retrieve('gameBoard');

    if (storedGameBoard) {
      if (Object.keys(storedGameBoard).length > 2) {
        _setGameBoard({ [storedGameBoard[0].length]: storedGameBoard });
      } else {
        _setGameBoard(storedGameBoard);
      }
    }
  }, []);

  useEffect(() => {
    let wordsToFetch = validGuesses;
    wordsToFetch = settings.wordLength === 5 ? validGuesses : sixLetterWords;

    fetch(wordsToFetch)
      .then((r) => r.text())
      .then((text) => {
        const validAnswers = text.split('\n');
        setAnswers(validAnswers);
        const randomAnswer =
          validAnswers[Math.floor(Math.random() * validAnswers.length)];

        const answerWord = retrieve('answer');
        if (answerWord && answerWord[settings.wordLength]) {
          setAnswer(answerWord);
        } else {
          setAnswer({ ...answerWord, [settings.wordLength]: randomAnswer });
          save('answer', {
            ...answerWord,
            [settings.wordLength]: randomAnswer,
          });
        }
      });
  }, [toggleWord, settings.wordLength]);

  const showGameBoard =
    gameBoard &&
    gameBoard[settings.wordLength] &&
    answer &&
    answer[settings.wordLength];

  const gameWon =
    gameBoard[settings.wordLength] &&
    !!gameBoard[settings.wordLength].find((row) =>
      row.every((letter) => letter.color === GREEN)
    );

  const gameOver = gameBoard[settings.wordLength]?.every((row) =>
    row.every((letter) => letter.color)
  );

  return (
    <div className="App">
      <Nav
        openSettings={() => setShowSettings(true)}
        openStats={() => setShowStats(true)}
      />
      {showGameBoard && (
        <Game
          setStats={setStats}
          answers={answers}
          answer={answer[settings.wordLength]}
          gameBoard={gameBoard[settings.wordLength]}
          setGameBoard={setGameBoard}
          gameWon={gameWon}
          gameOver={gameOver}
          hardMode={settings.hardMode}
          resetBoard={resetBoard}
        />
      )}

      <StatsModal
        showStats={showStats}
        gameWon={gameWon}
        answer={answer && answer[settings.wordLength]}
        gameOver={gameOver}
        distribution={guessDistribution}
        stats={stats}
        wordLength={settings.wordLength}
        closeModal={() => setShowStats(false)}
        resetBoard={resetBoard}
      />

      <SettingsModal
        showSettings={showSettings}
        gameOver={gameOver}
        settings={settings}
        setSettings={setSettings}
        closeModal={() => setShowSettings(false)}
      />

      {gameWon && showStats && (
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
