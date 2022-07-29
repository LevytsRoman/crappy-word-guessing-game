import { GREEN, YELLOW, GREY } from '../components/constants';

export type GameBoardType = {
  letter: string | null;
  color?: string;
}[][];

export const emptyBoard: (rows: number, wordLength: number) => GameBoardType = (
  rows,
  wordLength
) =>
  Array(rows)
    .fill(0)
    .map(() =>
      Array(wordLength)
        .fill(0)
        .map(() => ({
          letter: null,
        }))
    );

export const findIndexOfFirstEmptyRow = (board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (!board[i][j].letter) {
        return [i, j];
      }
    }
  }
  return [];
};

export const indexToDelete = (board) => {
  const [i, j] = findIndexOfFirstEmptyRow(board);
  const wordLength = board[0].length - 1;
  const boardLength = board.length - 1;
  if (!i && !j) {
    return [boardLength, wordLength];
  }

  if (j === 0 && !board[i - 1][wordLength].color) {
    return [i - 1, wordLength];
  }

  return [i, j - 1];
};

export const currentGuessArray = (board) =>
  board.findIndex((letters) => letters.some((letter) => !letter.color));

export const findColor = (
  row: { letter: string; color?: string }[],
  answer: string
) => {
  for (let i = 0; i < row.length; i++) {
    let answerIndex = answer.indexOf(row[i].letter);

    if (answerIndex === -1) {
      row[i].color = GREY;
    }

    if (row[i].letter === answer[i]) {
      row[i].color = GREEN;
    }
  }

  for (let i = 0; i < row.length; i++) {
    if (!row[i].color) {
      let used = row.filter(
        (l) => l.letter === row[i].letter && l.color
      ).length;
      let matcher = new RegExp(row[i].letter, 'g');
      if (used < answer.match(matcher).length) {
        row[i].color = YELLOW;
      } else {
        row[i].color = GREY;
      }
    }
  }

  return row;
};
