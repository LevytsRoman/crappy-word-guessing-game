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
