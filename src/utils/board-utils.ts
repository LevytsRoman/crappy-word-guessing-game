import { GREEN, YELLOW, GREY } from '../components/constants';

export type GameBoardType = {
  letter: string | null;
  color?: string;
}[][];

export const emptyBoard: () => GameBoardType = () => {
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

export const findIndexOfFirstEmptyRow = (board) => {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j].letter) {
        return [i, j];
      }
    }
  }
  return [];
};

export const indexToDelete = (board) => {
  const [i, j] = findIndexOfFirstEmptyRow(board);

  if (!i && !j) {
    return [5, 4];
  }

  if (j === 0 && !board[i - 1][4].color) {
    return [i - 1, 4];
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
