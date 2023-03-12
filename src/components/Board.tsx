import React, { useEffect, useState } from "react";
import { FloodFill, getCoverage, MovesLeft } from "../utils/FloodFill";

type Props = {};

export default function Board({}: Props) {
  const boardSize = 12;
  const indices = [...Array(boardSize).keys()];
  const [board, setBoard] = useState<number[][]>();
  const [movesLeft, setMovesLeft] = useState<number>(999);
  const [movesMade, setMovesMade] = useState<number>(0);
  const [capturesMade, setCapturesMade] = useState<number>(0);
  const [averageMove, setAverageMove] = useState<number>(0);
  const [bestMove, setBestMove] = useState<number>(0);

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
    const possibleMoves = MovesLeft(array);
    setMovesLeft(possibleMoves);
  };

  const cycleCell = (row: number, col: number) => {
    // user made a move by clicking
    // go red->white->blue->red
    // then capture neighbouring of the new color
    if (!board) return;
    let newBoard: number[][] = [...board];
    newBoard[row][col] = (board[row][col] + 1) % 3;
    const { newboard: postMoveBoard, captures } = FloodFill(newBoard, row, col);
    if (postMoveBoard) {
      setMovesMade(movesMade + 1);
      setCapturesMade(capturesMade + captures);
      setAverageMove((capturesMade + captures) / (movesMade + 1));
      if (captures > bestMove) {
        setBestMove(captures);
      }
      setBoard(postMoveBoard);
      const possibleMoves = MovesLeft(postMoveBoard);
      setMovesLeft(possibleMoves);
    }
  };

  const handleClick = (row: number, col: number) => {
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
            width="42"
            height="42"
            key={key}
            className={clazz}
            src="red.png"
          ></img>
        );
      case 1:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="42"
            height="42"
            key={key}
            className={clazz}
            src="white.png"
          ></img>
        );
      case 2:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="42"
            height="42"
            key={key}
            className={clazz}
            src="blue.png"
          ></img>
        );
      case 3:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width="42"
            height="42"
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
    return (
      <div className="mx-auto w-4/4 gap-0 my-4">
        <div className="">{indices.map((row: number) => drawRow(row))}</div>

        {movesLeft >= 0 ? (
          <div className="row mx-0">
            {movesLeft === 0 || !movesLeft ? (
              <div>
                <p className="font-bold text-xl">Game over</p>
                <p className="font-bold">{`Moves: ${movesMade} / Best Move: ${bestMove} / Average: ${averageMove.toFixed(
                  2
                )} / Coverage: ${getCoverage(board).toFixed(0)}%`}</p>
              </div>
            ) : (
              <p className="font-bold">{`Moves: ${movesMade} / Best Move: ${bestMove} / Average: ${averageMove.toFixed(
                2
              )} / Moves Left: ${movesLeft}`}</p>
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
