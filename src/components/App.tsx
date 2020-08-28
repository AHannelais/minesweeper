import React from "react";
import Grid from "./Grid";
import styled from "styled-components";

function App() {
  return (
    <Wrapper>
      <Grid />
    </Wrapper>
  );
}

export default App;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
`;
