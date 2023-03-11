const GRID_SIZE = 12;

export const getCoverage = (board: number[][]) => {
  // find percentage of cleared grid
  let emptyCells = 0;
  if (!board) return 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 3) {
        emptyCells++;
      }
    }
  }
  return (emptyCells / (GRID_SIZE * GRID_SIZE)) * 100.0;
};

export const MovesLeft = (board: number[][]) => {
  // a move is where a cell has a N,S,E or W neighbour which is
  // one more than itself, modulo 3. (0->1, 1->2, 2->0)
  if (!board) return 0;
  let movesLeft = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    const up = row === 0 ? null : row - 1;
    const down = row === GRID_SIZE - 1 ? null : row + 1;
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 3) continue;
      const left = col === 0 ? null : col - 1;
      const right = col === GRID_SIZE - 1 ? null : col + 1;
      const target = (board[row][col] + 1) % 3;
      if (left) {
        if (board[row][left] === target) {
          movesLeft += 1;
        }
      }
      if (right) {
        if (board[row][right] === target) {
          movesLeft += 1;
        }
      }
      if (up) {
        if (board[up][col] === target) {
          movesLeft += 1;
        }
      }
      if (down) {
        if (board[down][col] === target) {
          movesLeft += 1;
        }
      }
    }
  }
  console.log("Moves left", movesLeft);
  return movesLeft;
};

export const FloodFill = (board: number[][], row: number, col: number) => {
  // recursion free 4-way flood fill
  // fill out from [row,col] in the specified colour
  // expand out where pixel is transparent(0) or the same colour as the
  // cell at [row,col], so we can use to fill empty areas, or replace the
  // colour of an existing block

  if (!board) return null;

  const colorIndex = 3; // empty
  let captures = 0;

  const alreadyFilled = (row: number, col: number) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return true;
    if (newboard[row][col] === originalColor) return false;
    return true;
  };

  const fillPixel = (row: number, col: number, index: number) => {
    if (!alreadyFilled(row, col)) {
      newboard[row][col] = index;
      captures += 1;
    }
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
  console.log(`Captured ${captures - 1} pieces`);
  return { newboard, captures: captures - 1 };
};
