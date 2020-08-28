import React from "react";
const isHorrizontal = window.innerWidth > window.innerHeight ? true : false;

interface Props {
  width: number;
  height: number;
  bombAmount: number;
  onChangeWidth: (newWidth: number) => void;
  onChangeHeight: (newHeight: number) => void;
  onChangeBombAmount: (newBombAmount: number) => void;
  resetBoard: () => void;
}

function Settings({
  width,
  height,
  bombAmount,
  resetBoard,
  onChangeBombAmount,
  onChangeHeight,
  onChangeWidth,
}: Props) {
  const onChangeDifficulty = async (newDifficulty: string) => {
    switch (newDifficulty) {
      case "easy":
        onChangeBombAmount(10);
        onChangeHeight(isHorrizontal ? 8 : 11);
        onChangeWidth(isHorrizontal ? 11 : 8);
        break;
      case "normal":
        onChangeBombAmount(39);
        onChangeHeight(isHorrizontal ? 14 : 20);
        onChangeWidth(isHorrizontal ? 20 : 14);
        break;
      case "hard":
        onChangeBombAmount(102);
        onChangeHeight(isHorrizontal ? 20 : 29);
        onChangeWidth(isHorrizontal ? 29 : 20);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          onChangeDifficulty("easy");
        }}
      >
        Easy
      </button>
      <button
        onClick={() => {
          onChangeDifficulty("normal");
        }}
      >
        Normal
      </button>
      <button
        onClick={() => {
          onChangeDifficulty("hard");
        }}
      >
        Hard
      </button>
      <button onClick={resetBoard}>Reset</button>
    </div>
  );
}

export default Settings;
