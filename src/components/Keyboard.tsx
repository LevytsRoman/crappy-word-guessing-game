import classNames from 'classnames';
import { GREEN, YELLOW, DARK_GREY, GREY, KEYBOARD } from './constants';

type LetterBox = {
  setKey: ({ key: string }) => void;
  gameBoard: any;
};

const decideKeyClass = (key, gameBoard) => {
  const letterColors = {};

  for (const row of gameBoard) {
    for (const letter of row) {
      if (letter.letter === key) {
        letterColors[key]
          ? letterColors[key].push(letter.color)
          : (letterColors[key] = [letter.color]);
      }
    }
  }

  if (letterColors[key]?.some((letter) => letter === GREEN)) {
    return GREEN;
  }

  if (letterColors[key]?.some((letter) => letter === YELLOW)) {
    return YELLOW;
  }

  if (letterColors[key]?.some((letter) => letter === GREY)) {
    return DARK_GREY;
  }

  return '';
};

export default function Keyboard({ setKey, gameBoard }: LetterBox) {
  return (
    <div className="flex">
      {KEYBOARD.map((row, j) => (
        <div className="keyboard-row" key={j}>
          {row.map((letter, i) => (
            <div
              onClick={() => setKey({ key: letter })}
              style={{
                width:
                  letter === 'Backspace' || letter === 'Enter'
                    ? '100px'
                    : '50px',
              }}
              className={`keyboard-key ${decideKeyClass(letter, gameBoard)}`}
              key={i}
            >
              {letter === 'Backspace' ? '←' : letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
