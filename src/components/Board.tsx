import React, { useState } from "react";

type Props = {};

export default function Board({}: Props) {
  const boardSize = 12;
  const indices = [...Array(boardSize).keys()];
  const [board, setBoard] = useState<number[][]>();

  const resetBoard = () => {
    let array = [];
    for (let row = 0; row < boardSize; row++) {
      let thisRow = [];
      for (let row = 0; row < boardSize; row++) {
        let color = 1 + Math.floor(Math.random() * 3);
        thisRow.push(color);
      }
      array.push(thisRow);
    }
    setBoard(array);
    console.log("New board", array);
  };

  const drawCell = (row: number, col: number) => {
    if (!board) return;
    const clazz = "object-scale-down";
    const key = `cell_${row}_${col}`;
    switch (board[row][col]) {
      case 0:
        return <img width="48" height="48" key={key} className={clazz} src="empty.png"></img>;
        break;
      case 1:
        return <img width="48" height="48" key={key} className={clazz} src="red.png"></img>;
      case 2:
        return <img width="48" height="48" key={key} className={clazz} src="white.png"></img>;
      case 3:
        return <img width="48" height="48" key={key} className={clazz} src="blue.png"></img>;
    }
  };

  const drawRow = (row: number) => {
    return (
      <div key={row} className="flex flex-row">
        {indices.map((col: number) => drawCell(row, col))}
      </div>
    );
  };

  const drawBoard = () => {
    console.log("indeces", indices);
    return (
      <div className="container mx-auto w-1/2 h-1/2 flex flex-col gap-0">
        {indices.map((row: number) => drawRow(row))}
      </div>
    );
  };

  if (!board) {
    resetBoard();
  }

  return board ? drawBoard() : null;
}
