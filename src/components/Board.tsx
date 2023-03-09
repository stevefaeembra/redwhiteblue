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
        let color = Math.floor(Math.random() * 3);
        thisRow.push(color);
      }
      array.push(thisRow);
    }
    setBoard(array);
    console.log("New board", array);
  };

  const drawCell = (row: number, col: number) => {
    return <div>{`[${row},${col}]`}</div>;
  };

  const drawRow = (row: number) => {
    return indices.map((col: number) => drawCell(row, col));
  };

  const drawBoard = () => {
    console.log("indeces", indices);
    return <div className="container mx-auto  grid grid-cols-12">{indices.map((row: number) => drawRow(row))}</div>;
  };

  if (!board) {
    resetBoard();
  }

  return board ? drawBoard() : null;
}
