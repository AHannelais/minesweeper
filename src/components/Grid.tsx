import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Square from "./Square";
import Settings from "./Settings";

const isHorrizontal = window.innerWidth > window.innerHeight ? true : false;

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
  const [width, setWidth] = useState(isHorrizontal ? 20 : 14);
  const [height, setHeight] = useState(isHorrizontal ? 14 : 20);
  const [bombAmount, setBombAmount] = useState(39);
  const [gameState, setGameState] = useState<GameStateType[]>([]);
  const [isGameOver, setGameOver] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [isFistClick, setFirstClick] = useState(true);
  const [flags, setFlags] = useState(0);
  console.log("width ratio", (window.innerWidth / width) * 0.95);
  console.log("height ration", (window.innerHeight / height) * 0.85);
  const toTest =
    (window.innerWidth / width) * 0.95 < (window.innerHeight / height) * 0.85
      ? "width"
      : "heigth";
  const unit =
    toTest === "width"
      ? width * 50 < window.innerWidth * 0.95
        ? 50
        : (window.innerWidth * 0.95) / width
      : height * 50 < window.innerHeight * 0.85
      ? 50
      : (window.innerHeight * 0.85) / height;

  // eslint-disable-next-line
  useEffect(() => {
    if (!isGameWon && gameState && gameState.length > 0) {
      const newGameWon =
        gameState.filter((state) => state.status !== "revealed").length <=
          bombAmount ||
        !gameState.some((state) => state.bomb && state.status !== "flagged");
      if (newGameWon) {
        setGameWon(true);
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
    }
  });

  const onClickSquare = async (id: number) => {
    let checkGameState: GameStateType[] = gameState;
    if (isFistClick) checkGameState = await alwayClickEmptyOnFirstClick(id);
    if (checkGameState[id].status === "hidden" && !isGameOver && !isGameWon) {
      if (checkGameState[id].bomb) {
        setGameOver(true);
        setGameState(
          checkGameState.map((state) => ({
            ...state,
            status: state.bomb ? "revealed" : state.status,
          }))
        );
        return;
      }
      let newGameState = await checkSquare(id, checkGameState);
      setGameState(newGameState);
      forceUpdate();
    }
  };

  const alwayClickEmptyOnFirstClick = async (id: number) => {
    let newGameState = gameState;
    while (
      newGameState.length <= 0 ||
      newGameState[id].total !== 0 ||
      newGameState[id].bomb
    ) {
      newGameState = await createGameState();
    }
    setFirstClick(false);
    setGameState(newGameState);
    return newGameState;
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

  const checkSquare = async (id: number, gameState: GameStateType[]) => {
    const isLeftEdge = id % width === 0;
    const isRightEdge = id % width === width - 1;
    let newGameState = gameState;
    newGameState[id] = await { ...newGameState[id], status: "revealed" };
    if (!newGameState[id].total) {
      if (id > 0 && !isLeftEdge && newGameState[id - 1].status === "hidden") {
        //left
        newGameState = await checkSquare(id - 1, newGameState);
      }
      if (
        id > width - 1 &&
        !isRightEdge &&
        newGameState[id + 1 - width].status === "hidden"
      ) {
        //top-right
        newGameState = await checkSquare(id + 1 - width, newGameState);
      }
      if (id > width - 1 && newGameState[id - width].status === "hidden") {
        //top
        newGameState = await checkSquare(id - width, newGameState);
      }
      if (
        id > width &&
        !isLeftEdge &&
        newGameState[id - 1 - width].status === "hidden"
      ) {
        //top-left
        newGameState = await checkSquare(id - 1 - width, newGameState);
      }
      if (
        id < width * height - 1 &&
        !isRightEdge &&
        newGameState[id + 1].status === "hidden"
      ) {
        //right
        newGameState = await checkSquare(id + 1, newGameState);
      }
      if (
        id < width * height - width &&
        !isLeftEdge &&
        newGameState[id - 1 + width].status === "hidden"
      ) {
        //bot-left
        newGameState = await checkSquare(id - 1 + width, newGameState);
      }
      if (
        id < width * height - width - 1 &&
        !isRightEdge &&
        newGameState[id + 1 + width].status === "hidden"
      ) {
        //bot-right
        newGameState = await checkSquare(id + 1 + width, newGameState);
      }
      if (
        id < width * height - width &&
        newGameState[id + width].status === "hidden"
      ) {
        //bot
        newGameState = await checkSquare(id + width, newGameState);
      }
    }
    return newGameState;
  };
  const createGameState = async () => {
    let newGameState: GameStateType[] = [];
    const bombsArray = Array(bombAmount).fill(true);
    const validArray = Array(width * height - bombAmount).fill(false);
    const gameArray = validArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    for (let i = 0; i < width * height; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (i > 0 && !isLeftEdge && shuffledArray[i - 1]) total++; // left
      if (i > width - 1 && !isRightEdge && shuffledArray[i + 1 - width])
        total++; //top-right
      if (i > width - 1 && shuffledArray[i - width]) total++; //top
      if (i > width && !isLeftEdge && shuffledArray[i - 1 - width]) total++; //top-left
      if (i < width * height - 1 && !isRightEdge && shuffledArray[i + 1])
        total++; //right
      if (
        i < width * height - width &&
        !isLeftEdge &&
        shuffledArray[i - 1 + width]
      )
        total++; //bot-left
      if (
        i < width * height - width - 1 &&
        !isRightEdge &&
        shuffledArray[i + 1 + width]
      )
        total++; //bot-right
      if (i < width * height - width && shuffledArray[i + width]) total++; //bot
      newGameState = [
        ...newGameState,
        { bomb: shuffledArray[i], total, status: "hidden" },
      ];
    }
    setGameState(newGameState);
    return newGameState;
  };
  useEffect(() => {
    resetBoard();
    // eslint-disable-next-line
  }, [height, width, bombAmount]);

  const resetBoard = () => {
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
    setFlags(0);
    createGameState();
  };
  const onClickResetBoard = () => {
    if (isGameOver || isGameWon) {
      resetBoard();
    }
  };
  const onChangeWidth = async (newWidth: number) => {
    setWidth(newWidth);
    forceUpdate();
  };
  const onChangeHeight = (newHeight: number) => {
    setHeight(newHeight);
  };
  const onChangeBombAmount = (newBombAmount: number) => {
    setBombAmount(newBombAmount);
    forceUpdate();
  };

  const settingsProps = {
    width,
    height,
    bombAmount,
    onChangeBombAmount,
    onChangeHeight,
    onChangeWidth,
    resetBoard,
  };

  return (
    <div>
      <Settings {...settingsProps} />
      <span style={{ verticalAlign: "middle", fontSize: "30px" }}>
        🚩 : {bombAmount - flags}{" "}
      </span>
      <span style={{ verticalAlign: "middle", color: "grey" }}>
        PC : right click | Mobile : long touch
      </span>
      <Wrapper
        width={width}
        height={height}
        unit={unit}
        onClick={onClickResetBoard}
      >
        {gameState.map((squareState, index) => (
          <Square
            key={index}
            bomb={squareState.bomb}
            status={squareState.status}
            total={squareState.total}
            id={index}
            unit={unit}
            onClick={onClickSquare}
            onChangeFlag={onChangeFlag}
          />
        ))}
      </Wrapper>
      {isGameOver ? "Game Over " : isGameWon ? "Congratulation" : ""}
    </div>
  );
}

export default Grid;

interface WrapperProps {
  height: number;
  width: number;
  unit: number;
}

const Wrapper = styled.div`
  height: ${(p: WrapperProps) => `${p.height * p.unit}px`};
  width: ${(p: WrapperProps) => `${p.width * p.unit}px`};
  display: flex;
  flex-wrap: wrap;
  background-color: #dcd6bc;
  margin: auto 0;
  border: 10px solid #dcd6bc;
`;
