import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import Confetti from 'react-confetti';
import validGuesses from '../words.txt';
import Letter from './Letter';
import FlippingLetter from './FlippingLetter';
import classNames from 'classnames';
import Keyboard from './Keyboard';
import { GREEN, YELLOW, GREY, LETTER_LIST } from './constants';

const emptyBoard: () => { letter: string | null; color?: string }[][] = () => {
  return Array(6)
    .fill(0)
    .map(() =>
      Array(5)
        .fill(0)
        .map(() => ({
          letter: null,
        }))
    );
};

const findIndexOfFirstEmptyRow = (board) => {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j].letter) {
        return [i, j];
      }
    }
  }
  return [];
};

const indexToDelete = (board) => {
  const [i, j] = findIndexOfFirstEmptyRow(board);

  if (!i && !j) {
    return [5, 4];
  }

  if (j === 0 && !board[i - 1][4].color) {
    return [i - 1, 4];
  }

  return [i, j - 1];
};

const currentGuessArray = (board) =>
  board.findIndex((letters) => letters.some((letter) => !letter.color));

function Game() {
  const [gameBoard, _setGameBoard] = useState(emptyBoard);
  const [shakeRow, setShakeRow] = useState<number | boolean>(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const answers = useRef<String[]>([]);
  const answer = useRef<String>();

  const gameBoardRef = useRef(gameBoard);

  const setGameBoard = (gameBoard) => {
    gameBoardRef.current = gameBoard;
    _setGameBoard(gameBoard);
  };

  const handleEnterClick = (newGameBoard, currentGuessRowIndex) => {
    let currentGuessRow = newGameBoard[currentGuessRowIndex];

    const guessInList = answers.current.find(
      (a) => a === currentGuessRow?.map((letter) => letter.letter).join('')
    );

    if (guessInList) {
      const answerWord = answer.current;

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

        const totalNumberInWord =
          answer.current.split(letterObject.letter).length - 1;
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
          answer.current.toLowerCase().indexOf(letterObject.letter) >= 0;
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
      if (gameWon || gameOver) {
        return;
      }

      const incomingLetter = e.key;
      let newGameBoard = [...gameBoardRef.current];

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
        setGameWon(gameIsWon);

        setGameOver(currentGuessRowIndex === 5);
      }

      setGameBoard(newGameBoard);
    },
    [gameBoardRef, gameWon, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', setKey);

    fetch(validGuesses)
      .then((r) => r.text())
      .then((text) => {
        const validAnswers = text.split('\n');
        answers.current = validAnswers;
        const randomAnswer =
          validAnswers[Math.floor(Math.random() * validAnswers.length)];
        console.log(randomAnswer);
        answer.current = randomAnswer;
      });

    return () => {
      window.removeEventListener('keydown', setKey);
    };
  }, [setKey, answer]);

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
              gameBoard[i][4].color ? (
                <FlippingLetter letter={letter} key={j} />
              ) : (
                <Letter letter={letter} key={j} />
              )
            )}
          </div>
        ))}
        {gameOver && <div>You lose, the word was {answer.current}</div>}
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
