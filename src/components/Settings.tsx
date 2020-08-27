import React from "react";
interface Props {
  id: number;
  bomb: boolean;
  total: number;
  status: "hidden" | "revealed" | "flagged";
  onClick: (id: number) => void;
  onChangeFlag: (ev: any, id: number) => void;
}

function Square({ bomb, id, status, total, onClick, onChangeFlag }: Props) {
  return (
    <div
      style={{
        backgroundColor:
          status === "revealed" ? (bomb ? "orange" : "green") : "grey",
        textAlign: "center",
      }}
      onClick={() => onClick(id)}
      onContextMenu={(ev) => onChangeFlag(ev, id)}
    >
      <span style={{ verticalAlign: "middle" }}>
        {status === "revealed" && !bomb && total ? total : ""}
        {status === "flagged" ? "F" : ""}
      </span>
    </div>
  );
}

export default Square;
