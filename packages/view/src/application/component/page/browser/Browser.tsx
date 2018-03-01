import * as React from "react";
import styled from "styled-components";

import { Explorer } from "./Explorer";
import { Canvas } from "./Canvas";

export const Browser: React.SFC<{}> = _ => (
  <Window>
    <Explorer />
    <Canvas />
  </Window>
);

const Window = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 100%;
  width: 100%;
  height: 100%;
`;
