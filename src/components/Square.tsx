import React from "react";
import styled from "styled-components";

interface Props {
  id: number;
  bomb: boolean;
  total: number;
  unit: number;
  status: "hidden" | "revealed" | "flagged";
  onClick: (id: number) => void;
  onChangeFlag: (ev: any, id: number) => void;
}

function Square({
  bomb,
  id,
  status,
  total,
  onClick,
  onChangeFlag,
  unit,
}: Props) {
  const getBackgroundColor = () => {
    if (status === "revealed") {
      if (bomb) return "orange";
      return "#cecab7";
    }
    return "default";
  };
  const getBorderColor = () => {
    if (status === "revealed") {
      if (bomb) return "#f5f3eb #bab7a9 #bab7a9 #fff9db";
      return "#9c998d";
    }
    return "#f5f3eb #bab7a9 #bab7a9 #fff9db";
  };

  const getTextColor = () => {
    if (status === "flagged") return "default";
    switch (total) {
      case 1:
        return "green";
      case 2:
        return "blue";
      case 3:
        return "red";
      case 4:
        return "purple";
      default:
        return "default";
    }
  };
  return (
    <Wrapper
      backgroundColor={getBackgroundColor()}
      textColor={getTextColor()}
      borderColor={getBorderColor()}
      unit={unit}
      onClick={() => onClick(id)}
      onContextMenu={(ev) => onChangeFlag(ev, id)}
    >
      <span style={{ verticalAlign: "middle" }}>
        {status === "revealed" && !bomb && total ? total : ""}
        {status === "flagged" ? "🚩" : ""}
        {status === "revealed" && bomb ? "💣" : ""}
      </span>
    </Wrapper>
  );
}

export default Square;

interface WrapperProps {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  unit: number;
}

const Wrapper = styled.div`
  height: ${(p: WrapperProps) => `${p.unit}px`};
  width: ${(p: WrapperProps) => `${p.unit}px`};
  font-size: ${(p: WrapperProps) => `${p.unit / 2}px`};
  box-sizing: border-box;
  background-color: ${(p: WrapperProps) => p.backgroundColor};
  color: ${(p: WrapperProps) => p.textColor};
  text-align: center;
  border: ${(p: WrapperProps) => (p.borderColor === "#9c998d" ? "2px" : "5px")}
    solid;
  border-color: ${(p: WrapperProps) => p.borderColor};
`;
