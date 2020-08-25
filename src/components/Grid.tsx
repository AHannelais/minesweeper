import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Square from "./Square";

interface GameStateType {
  bomb: boolean;
  total: number;
  status: "hidden" | "revealed" | "flagged";
}
//create your forceUpdate hook
function useForceUpdate() {
  // eslint-disable-next-line
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => ++value); // update the state to force render
}

function Grid() {
  const forceUpdate = useForceUpdate();
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(20);
  const [bombAmount, setBombAmount] = useState(5);
  const [gameState, setGameState] = useState<GameStateType[]>([]);
  const [isGameOver, setGameOver] = useState(false);
  const [flags, setFlags] = useState(0);

  const isGameWon =
    gameState.filter((state) => state.status !== "revealed").length <=
      bombAmount ||
    !gameState.some((state) => state.bomb && state.status !== "flagged");

  const onClickSquare = async (id: number) => {
    if (gameState[id].status === "hidden" && !isGameOver && !isGameWon) {
      if (gameState[id].bomb) {
        setGameState(
          gameState.map((state) => ({
            ...state,
            status: state.bomb ? "revealed" : state.status,
          }))
        );
        setGameOver(true);
        return;
      }
      let newGameState = await checkSquare(id, gameState);
      setGameState(newGameState);
      forceUpdate();
    }
  };

  const onChangeFlag = (ev: any, id: number) => {
    ev.preventDefault();
    if (!isGameOver && gameState[id].status !== "revealed") {
      let newGameState = [...gameState];
      if (gameState[id].status === "flagged") {
        newGameState[id].status = "hidden";
        setFlags(flags - 1);
        return setGameState(newGameState);
      }
      if (gameState[id].status === "hidden" && flags < bombAmount) {
        newGameState[id].status = "flagged";
        setFlags(flags + 1);
        return setGameState(newGameState);
      }
    }
  };
  useEffect(() => {
    if (isGameWon && gameState.length > 0 && !isGameOver) {
      setGameOver(true);
      setGameState(
        gameState.map((state) => ({
          ...state,
          status:
            state.bomb && state.status !== "flagged"
              ? "revealed"
              : state.status,
        }))
      );
    }
  }, [isGameWon, gameState, isGameOver]);
  const checkSquare = async (id: number, gameState: GameStateType[]) => {
    const isLeftEdge = id % width === 0;
    const isRightEdge = id % width === width - 1;
    let newGameState = gameState;
    newGameState[id] = await { ...newGameState[id], status: "revealed" };
    if (!newGameState[id].total) {
      if (id > 0 && !isLeftEdge && newGameState[id - 1].status === "hidden") {
        newGameState = await checkSquare(id - 1, newGameState);
      }
      if (
        id > width - 1 &&
        !isRightEdge &&
        newGameState[id + 1 - width].status === "hidden"
      ) {
        newGameState = await checkSquare(id + 1 - width, newGameState);
      }
      if (id > width && newGameState[id - width].status === "hidden") {
        newGameState = await checkSquare(id - width, newGameState);
      }
      if (
        id > width + 1 &&
        !isLeftEdge &&
        newGameState[id - 1 - width].status === "hidden"
      ) {
        newGameState = await checkSquare(id - 1 - width, newGameState);
      }
      if (
        id < width * height - 2 &&
        !isRightEdge &&
        newGameState[id + 1].status === "hidden"
      ) {
        newGameState = await checkSquare(id + 1, newGameState);
      }
      if (
        id < width * height - width &&
        !isLeftEdge &&
        newGameState[id - 1 + width].status === "hidden"
      ) {
        newGameState = await checkSquare(id - 1 + width, newGameState);
      }
      if (
        id < width * height - width - 1 &&
        !isRightEdge &&
        newGameState[id + 1 + width].status === "hidden"
      ) {
        newGameState = await checkSquare(id + 1 + width, newGameState);
      }
      if (
        id < width * height - width &&
        newGameState[id + width].status === "hidden"
      ) {
        newGameState = await checkSquare(id + width, newGameState);
      }
    }
    return newGameState;
  };
  const createGameState = () => {
    let newGameState: GameStateType[] = [];
    const bombsArray = Array(bombAmount).fill(true);
    const validArray = Array(width * height - bombAmount).fill(false);
    const gameArray = validArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    for (let i = 0; i < width * height; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      if (i > 0 && !isLeftEdge && shuffledArray[i - 1]) total++;
      if (i > width - 1 && !isRightEdge && shuffledArray[i + 1 - width])
        total++;
      if (i > width && shuffledArray[i - width]) total++;
      if (i > width && !isLeftEdge && shuffledArray[i - 1 - width]) total++;
      if (i < width * height - 2 && !isRightEdge && shuffledArray[i + 1])
        total++;
      if (
        i < width * height - width &&
        !isLeftEdge &&
        shuffledArray[i - 1 + width]
      )
        total++;
      if (
        i < width * height - width - 2 &&
        !isRightEdge &&
        shuffledArray[i + 1 + width]
      )
        total++;
      if (i < width * height - width - 1 && shuffledArray[i + width]) total++;

      newGameState = [
        ...newGameState,
        { bomb: shuffledArray[i], total, status: "hidden" },
      ];
    }
    setGameState(newGameState);
  };
  useEffect(() => {
    createGameState();
    // eslint-disable-next-line
  }, []);

  const resetBoard = () => {
    if (isGameOver || isGameWon) {
      setGameOver(false);
      setFlags(0);
      createGameState();
    }
  };

  return (
    <div onClick={resetBoard}>
      <Wrapper width={width} height={height}>
        {gameState.map((squareState, index) => (
          <Square
            key={index}
            bomb={squareState.bomb}
            status={squareState.status}
            total={squareState.total}
            id={index}
            onClick={onClickSquare}
            onChangeFlag={onChangeFlag}
          />
        ))}
      </Wrapper>
      {isGameOver ? (isGameWon ? "Congratulation" : "Game Over ") : ""}
    </div>
  );
}

export default Grid;

interface WrapperProps {
  height: number;
  width: number;
}

const Wrapper = styled.div`
  height: ${(p: WrapperProps) => `${p.height * 40}px`};
  width: ${(p: WrapperProps) => `${p.width * 40}px`};
  display: flex;
  flex-wrap: wrap;
  background-color: gray;
  div {
    height: 40px;
    width: 40px;
  }
`;
