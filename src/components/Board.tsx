import React, { useEffect, useState } from "react";
import { FloodFill, getCoverage, MovesLeft } from "../utils/FloodFill";
import { useLocalStorage } from "usehooks-ts";

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
  const [bestMoveHighScore, setBestMoveHighScore] = useLocalStorage("redwhiteblue.bestMove", "0");
  const [bestAverageScore, setBestAverageScore] = useLocalStorage("redwhiteblue.bestAverage", "0.0");
  const [highScore, setHighScore] = useLocalStorage("redwhiteblue.bestScore", "0");
  const [newBestMoveRecord, setNewBestMoveRecord] = useState(false);
  const [newAverageScoreRecord, setNewAverageScoreRecord] = useState(false);

  const [newHighScoreRecord, setNewHighScoreRecord] = useState(false);

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

  useEffect(() => {
    if (movesLeft === 0) {
      // end the game
      const gameScore = parseInt((averageMove * bestMove).toFixed(0));
      if (gameScore > parseInt(highScore)) {
        setHighScore(gameScore.toString());
        setNewHighScoreRecord(true);
      }
      if (averageMove > parseFloat(bestAverageScore)) {
        setBestAverageScore(averageMove.toFixed(2));
        setNewAverageScoreRecord(true);
      }
      if (bestMove > parseInt(bestMoveHighScore)) {
        setBestMoveHighScore(bestMove.toString());
        setNewBestMoveRecord(true);
      }
    }
  }, [movesLeft]);

  const cycleCell = (row: number, col: number) => {
    // user made a move by clicking
    // go red->white->blue->red
    // then capture neighbouring of the new color
    if (!board) return;
    let newBoard: number[][] = [...board];
    newBoard[row][col] = (board[row][col] + 1) % 3;
    //@ts-ignore
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
    if (movesLeft === 0) return;
    cycleCell(row, col);
  };

  const drawCell = (row: number, col: number) => {
    if (!board) return;
    const clazz = "object-scale-down";
    const key = `cell_${row}_${col}`;
    const screenWidth = window.innerWidth;
    let iconSize = 40;
    if (screenWidth < 512) {
      iconSize = screenWidth / 12;
    }
    console.log("screenWidth", screenWidth);
    switch (board[row][col]) {
      case 0:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width={iconSize}
            height={iconSize}
            key={key}
            className={clazz}
            src="red.png"
          ></img>
        );
      case 1:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width={iconSize}
            height={iconSize}
            key={key}
            className={clazz}
            src="white.png"
          ></img>
        );
      case 2:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width={iconSize}
            height={iconSize}
            key={key}
            className={clazz}
            src="blue.png"
          ></img>
        );
      case 3:
        return (
          <img
            onClick={() => handleClick(row, col)}
            width={iconSize}
            height={iconSize}
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
        <div className="mx-auto w-1/3">
          <img src="/redwhitebluelogo.png" />
        </div>
        <div className="">{indices.map((row: number) => drawRow(row))}</div>

        {movesLeft >= 0 ? (
          <div className="row mx-0">
            {movesLeft === 0 || !movesLeft ? (
              <div>
                <div className="mx-auto w-1/3">
                  <img alt="Game over!" src="/redwhitebluegameover.png" />
                </div>
                <div className="stats stats-vertical md:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-title">Moves Made</div>
                    <div className="stat-value">{movesMade}</div>
                    <div className="stat-desc">&nbsp;</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Best move</div>
                    <div className="stat-value">{bestMove}</div>
                    <div className="stat-desc">{newBestMoveRecord ? "New high!" : "  "}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Average</div>
                    <div className="stat-value">{averageMove.toFixed(2)}</div>
                    <div className="stat-desc">{newAverageScoreRecord ? "New high!" : "  "}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Score</div>
                    <div className="stat-value">{(averageMove * bestMove).toFixed(0)}</div>
                    <div className="stat-desc">{newHighScoreRecord ? "New high!" : "  "}</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="stats stats-vertical md:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-title">Moves Made</div>
                    <div className="stat-value">{movesMade}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Best move</div>
                    <div className="stat-value">{bestMove}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Average</div>
                    <div className="stat-value">{averageMove.toFixed(2)}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Moves Left</div>
                    <div className="stat-value">{movesLeft}</div>
                  </div>
                </div>
              </>
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
