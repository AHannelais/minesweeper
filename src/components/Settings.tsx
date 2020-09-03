import React from "react";
const isHorrizontal = window.innerWidth > window.innerHeight ? true : false;
import styled from "styled-components";
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
      case "expert":
        onChangeBombAmount(230);
        onChangeHeight(isHorrizontal ? 26 : 38);
        onChangeWidth(isHorrizontal ? 38 : 26);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          onChangeDifficulty("easy");
        }}
      >
        Easy
      </Button>
      <Button
        onClick={() => {
          onChangeDifficulty("normal");
        }}
      >
        Normal
      </Button>
      <Button
        onClick={() => {
          onChangeDifficulty("hard");
        }}
      >
        Hard
      </Button>
      <Button
        onClick={() => {
          onChangeDifficulty("expert");
        }}
      >
        Expert
      </Button>
      <Button onClick={resetBoard}>Reset</Button>
    </div>
  );
}

export default Settings;
const Button = styled.button`
  .myButton {
    box-shadow: inset 0px 1px 0px 0px #ffffff;
    background: linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
    background-color: #ededed;
    border-radius: 6px;
    border: 1px solid #dcdcdc;
    display: inline-block;
    cursor: pointer;
    color: #777777;
    font-family: Arial;
    font-size: 15px;
    font-weight: bold;
    padding: 10px 24px;
    text-decoration: none;
    margin : 10px
    text-shadow: 0px 1px 0px #ffffff;
    :hover {
      background: linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
      background-color: #dfdfdf;
    }
    :active {
      position: relative;
      top: 1px;
    }
  }
`;
