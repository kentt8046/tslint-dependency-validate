import * as React from "react";
import styled from "styled-components";

export const Canvas: React.SFC<{}> = _ => <Container>canvas</Container>;

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: #1e1e1e;
`;
