import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import Letter from './Letter';
import FlippingLetter from './FlippingLetter';
import classNames from 'classnames';
import Keyboard from './Keyboard';
import { GREEN, YELLOW, GREY, LETTER_LIST } from './constants';
import { save, retrieve } from '../storage/localStorage';
import {
  GameBoardType,
  findIndexOfFirstEmptyRow,
  currentGuessArray,
  indexToDelete,
} from '../utils/board-utils';
import Notification from './Notification';
const useFlipRow = (board, i) => {
  return (
    board[i].every((letter) => letter.color) &&
    board[i + 1] &&
    board[i + 1].some((letter) => !letter.color)
  );
};

type GameProps = {
  setStats: (result: boolean | number) => void;
  setGameBoard: (gameBoard: GameBoardType) => void;
  gameBoard: any;
  answers: string[];
  answer: string;
  gameWon: boolean;
  gameOver: boolean;
  hardMode: boolean;
  resetBoard: () => void;
};

function Game({
  setStats,
  gameBoard,
  setGameBoard,
  resetBoard,
  answers,
  answer,
  gameWon,
  gameOver,
  hardMode,
}: GameProps) {
  const [shakeRow, setShakeRow] = useState<number | boolean>(false);
  const [error, _setError] = useState<boolean | string>(false);

  const setError = (error) => {
    _setError(error);

    setTimeout(() => _setError(false), 2000);
  };

  const handleEnterClick = (newGameBoard, currentGuessRowIndex) => {
    let currentGuessRow = newGameBoard[currentGuessRowIndex];

    const guessInList = answers.find(
      (a) => a === currentGuessRow?.map((letter) => letter.letter).join('')
    );
    let newError;
    if (currentGuessRow.some((letter) => !letter.letter)) {
      newError = 'Guess is too short';
    } else if (!guessInList) {
      newError = 'Not a valid word';
    } else if (hardMode && newGameBoard[currentGuessRowIndex - 1]) {
      const previousRow = newGameBoard[currentGuessRowIndex - 1];
      console.log(previousRow);
      for (const [i, letter] of previousRow.entries()) {
        if (
          letter.color === GREEN &&
          currentGuessRow[i].letter !== letter.letter
        ) {
          newError = `${letter.letter} must be in position ${i + 1}`;
          break;
        }
        if (
          letter.color === YELLOW &&
          !currentGuessRow.find(
            (guessLEtter) => guessLEtter.letter === letter.letter
          )
        ) {
          newError = `${letter.letter} must be in word`;
          break;
        }
      }
    }

    if (guessInList && !newError) {
      const answerWord = answer;

      // finds all green letters
      currentGuessRow = currentGuessRow.map((letterObject, index) => {
        if (letterObject.letter === answerWord[index]) {
          return {
            letter: letterObject.letter,
            color: GREEN,
          };
        }

        return {
          letter: letterObject.letter,
        };
      });

      currentGuessRow = currentGuessRow.map((letterObject, index) => {
        if (letterObject.color) {
          return letterObject;
        }

        const totalNumberInWord = answer.split(letterObject.letter).length - 1;
        const accountedFor = currentGuessRow
          .slice(0, index)
          .filter((a) => a.letter === letterObject.letter).length;
        const greenLater =
          currentGuessRow
            .slice(index, currentGuessRow.length)
            .filter(
              (a) => a.letter === letterObject.letter && letterObject.color
            ).length > 0;
        const letterYellow =
          totalNumberInWord > accountedFor &&
          !greenLater &&
          answer.toLowerCase().indexOf(letterObject.letter) >= 0;
        if (letterYellow) {
          return {
            letter: letterObject.letter,
            color: YELLOW,
          };
        }

        return {
          letter: letterObject.letter,
          color: GREY,
        };
      });
    } else {
      setError(newError);
      setShakeRow(currentGuessRowIndex);
      setTimeout(() => setShakeRow(false), 200);
    }
    return currentGuessRow;
  };

  const setKey = useCallback(
    (e) => {
      if (gameWon || gameOver || e.ctrlKey) {
        return;
      }

      const incomingLetter = e.key;
      let newGameBoard = [...gameBoard];

      const [i, j] = findIndexOfFirstEmptyRow(newGameBoard);

      if (
        LETTER_LIST.indexOf(incomingLetter) >= 0 &&
        (i < 1 || (newGameBoard[i - 1] && newGameBoard[i - 1][4].color))
      ) {
        newGameBoard[i][j] = {
          letter: incomingLetter,
        };
      }

      if (incomingLetter === 'Backspace') {
        let [row, letter] = indexToDelete(newGameBoard);

        newGameBoard[row][letter] = {
          letter: null,
        };
      }

      if (incomingLetter === 'Enter') {
        let currentGuessRowIndex = currentGuessArray(newGameBoard);
        let currentGuessRow = handleEnterClick(
          newGameBoard,
          currentGuessRowIndex
        );

        newGameBoard[currentGuessRowIndex] = currentGuessRow;

        const gameIsWon = currentGuessRow.every(
          (letter) => letter.color === GREEN
        );

        const gameOver = currentGuessRowIndex === 5 && currentGuessRow[4].color;

        if (gameIsWon) {
          setStats(currentGuessRowIndex);
        } else if (gameOver) {
          setStats(false);
        }
      }
      save('gameBoard', newGameBoard);
      setGameBoard(newGameBoard);
    },
    [gameBoard, gameWon, gameOver, answer, answers]
  );

  useEffect(() => {
    window.addEventListener('keydown', setKey);

    return () => {
      window.removeEventListener('keydown', setKey);
    };
  }, [setKey]);

  useLayoutEffect(() => {
    const list = document.querySelectorAll('.should-flip');
    setTimeout(() => {
      list[list.length - 1]?.classList.add('flip');
    }, 10);
  });

  return (
    <div className="game-container">
      {error && <Notification text={error as string} />}
      <div className="flex board">
        {gameBoard.map((row, i) => (
          <div
            className={classNames('game-row', {
              'shake-row': shakeRow === i,
              'should-flip': row[4].color,
            })}
            key={i}
          >
            {row.map((letter, j) =>
              useFlipRow(gameBoard, i) ? (
                <FlippingLetter letter={letter} key={j} />
              ) : (
                <Letter letter={letter} key={j} />
              )
            )}
          </div>
        ))}
        <div className="flex margin-top">
          {gameOver && <div>You lose, the word was {answer}</div>}

          {(gameOver || gameWon) && (
            <button className="button" onClick={resetBoard}>
              Play Again
            </button>
          )}
        </div>
      </div>
      <Keyboard gameBoard={gameBoard} setKey={setKey} />
    </div>
  );
}

export default Game;
