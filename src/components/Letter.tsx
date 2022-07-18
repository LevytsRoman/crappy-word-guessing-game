import classNames from 'classnames';

type LetterBox = {
  letter: {
    letter: string;
    color?: string;
  };
};

export default function Letter({ letter }: LetterBox) {
  return (
    <div
      className={classNames('letter-guess', {
        [letter.color]: letter.color,
        'letter-filled': letter.letter,
      })}
    >
      {letter.letter}
    </div>
  );
}
