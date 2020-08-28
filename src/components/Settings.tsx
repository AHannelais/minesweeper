import React from "react";
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
        onChangeHeight(8);
        onChangeWidth(11);
        break;
      case "normal":
        onChangeBombAmount(39);
        onChangeHeight(14);
        onChangeWidth(20);
        break;
      case "hard":
        onChangeBombAmount(102);
        onChangeHeight(20);
        onChangeWidth(29);
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
