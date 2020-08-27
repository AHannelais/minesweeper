import React from "react";
import styled from "styled-components";

interface Props {
  id: number;
  bomb: boolean;
  total: number;
  status: "hidden" | "revealed" | "flagged";
  onClick: (id: number) => void;
  onChangeFlag: (ev: any, id: number) => void;
}

function Square({ bomb, id, status, total, onClick, onChangeFlag }: Props) {
  const backgroundColor =
    status === "revealed" ? (bomb ? "orange" : "wheat") : "grey";

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
      backgroundColor={backgroundColor}
      textColor={getTextColor()}
      onClick={() => onClick(id)}
      onContextMenu={(ev) => onChangeFlag(ev, id)}
    >
      <span style={{ verticalAlign: "middle" }}>
        {status === "revealed" && !bomb && total ? total : ""}
        {status === "flagged" ? "F" : ""}
      </span>
    </Wrapper>
  );
}

export default Square;

interface WrapperProps {
  backgroundColor: string;
  textColor: string;
}

const Wrapper = styled.div`
  height: 40px;
  width: 40px;
  background-color: ${(p: WrapperProps) => p.backgroundColor};
  color: ${(p: WrapperProps) => p.textColor};
  text-align: center;
`;
//  {status === "revealed" && !bomb && total ? total : ""}
//  {status === "flagged" ? "F" : ""}
