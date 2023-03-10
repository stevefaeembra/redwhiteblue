import React, { useEffect, useState } from "react";
import { FloodFill, MovesLeft } from "../utils/FloodFill";

type Props = {};

export default function Board({}: Props) {
  const boardSize = 12;
  const indices = [...Array(boardSize).keys()];
  const [board, setBoard] = useState<number[][]>();
  const [movesLeft, setMovesLeft] = useState<number>(999);

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
  };

  const cycleCell = (row: number, col: number) => {
    if (!board) return;
    let newBoard: number[][] = [...board];
    newBoard[row][col] = (board[row][col] + 1) % 3;
    const postMoveBoard = FloodFill(newBoard, row, col);
    if (postMoveBoard) {
      setBoard(postMoveBoard);
      const possibleMoves = MovesLeft(postMoveBoard);
      setMovesLeft(possibleMoves);
    }
  };

  const handleClick = (row: number, col: number) => {
    //alert(`Clicked row ${row}, column ${col}`);
    cycleCell(row, col);
  };

  const drawCell = (row: number, col: number) => {
    if (!board) return;
    const clazz = "object-scale-down";
    const key = `cell_${row}_${col}`;
    switch (board[row][col]) {
      case 0:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="48"
            height="48"
            key={key}
            className={clazz}
            src="red.png"
          ></img>
        );
      case 1:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="48"
            height="48"
            key={key}
            className={clazz}
            src="white.png"
          ></img>
        );
      case 2:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="48"
            height="48"
            key={key}
            className={clazz}
            src="blue.png"
          ></img>
        );
      case 3:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="48"
            height="48"
            key={key}
            className={clazz}
            src="empty.png"
          ></img>
        );
        break;
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
    // if (movesLeft == 0) {
    //   debugger;
    // }
    return (
      <div className="contianer mx-auto w-1/2 h-1/2 grid gap-0">
        <div className="row">
          <div className="">{indices.map((row: number) => drawRow(row))}</div>
        </div>
        {movesLeft >= 0 ? (
          <div className="row">
            {movesLeft === 0 || !movesLeft ? (
              <h1>No moves left </h1>
            ) : (
              <h1 className="">{`${movesLeft} moves left`}</h1>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  if (!board) {
    resetBoard();
  }

  useEffect(() => {
    drawBoard();
  }, [movesLeft]);

  return board ? drawBoard() : null;
}
