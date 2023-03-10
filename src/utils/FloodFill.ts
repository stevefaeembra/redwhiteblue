const GRID_SIZE = 12;

export const FloodFill = (board: number[][], row: number, col: number) => {
  // recursion free 4-way flood fill
  // fill out from [row,col] in the specified colour
  // expand out where pixel is transparent(0) or the same colour as the
  // cell at [row,col], so we can use to fill empty areas, or replace the
  // colour of an existing block

  if (!board) return null;

  const colorIndex = 3; // empty

  const alreadyFilled = (row: number, col: number) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return true;
    if (newboard[row][col] === originalColor) return false;
    return true;
  };

  const fillPixel = (row: number, col: number, index: number) => {
    if (!alreadyFilled(row, col)) newboard[row][col] = index;
    if (!alreadyFilled(row - 1, col)) {
      queue.push([row - 1, col]);
    }
    if (!alreadyFilled(row + 1, col)) {
      queue.push([row + 1, col]);
    }
    if (!alreadyFilled(row, col - 1)) {
      queue.push([row, col - 1]);
    }
    if (!alreadyFilled(row, col + 1)) {
      queue.push([row, col + 1]);
    }
  };

  let queue = [];
  const newboard = [...board];
  const originalColor = board[row][col];
  queue.push([row, col]);
  while (queue.length > 0) {
    const cell = queue.pop();
    const [r, c] = cell;
    fillPixel(r, c, colorIndex);
  }
  return newboard;
};
