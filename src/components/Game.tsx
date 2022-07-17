import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import Confetti from 'react-confetti';
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
  setGameWon: (gameWon: boolean) => void;
  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;
};

function Game({
  setStats,
  gameBoard,
  setGameBoard,
  answers,
  answer,
  gameWon,
  setGameWon,
  gameOver,
  setGameOver,
}: GameProps) {
  const [shakeRow, setShakeRow] = useState<number | boolean>(false);

  const handleEnterClick = (newGameBoard, currentGuessRowIndex) => {
    let currentGuessRow = newGameBoard[currentGuessRowIndex];

    const guessInList = answers.find(
      (a) => a === currentGuessRow?.map((letter) => letter.letter).join('')
    );

    if (guessInList) {
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

        const gameOver = currentGuessRowIndex === 5;

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
    <div style={{ width: '100%' }}>
      <div className="keyboard-wrapper">
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
        {gameOver && <div>You lose, the word was {answer}</div>}
        {gameWon && (
          <div>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
            {Math.random() > 0.05
              ? 'win'
              : "Can't believe you didn't guess it sooner, it was so obvious!"}
          </div>
        )}
      </div>
      <Keyboard gameBoard={gameBoard} setKey={setKey} />
    </div>
  );
}

export default Game;
