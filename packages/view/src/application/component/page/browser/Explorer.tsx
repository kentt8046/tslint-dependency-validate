import * as React from "react";
import styled from "styled-components";

import { IconButton } from "../../object/Button";

interface ExplorerProps {}
export const Explorer: React.SFC<ExplorerProps> = _ => (
  <Container>
    <>
      <Title>
        <div>dependencies</div>
        <div>
          <IconButton icon="plus" onClick={console.log} />
        </div>
      </Title>
      <List>
        <ListItem
          onContextMenu={e => {
            // console.log("context menu");
            e.preventDefault();
          }}
        >
          1
        </ListItem>
        <ListItem>2</ListItem>
        <ListItem>3</ListItem>
        <ListItem>4</ListItem>
        <ListItem>5</ListItem>
        <ListItem>6</ListItem>
        <ListItem>7</ListItem>
        <ListItem>8</ListItem>
        <ListItem>9</ListItem>
        <ListItem>10</ListItem>
      </List>
    </>
    <>
      <Title>project</Title>
      <List>
        <ListItem>1</ListItem>
        <ListItem>2</ListItem>
        <ListItem>3</ListItem>
        <ListItem>4</ListItem>
        <ListItem>5</ListItem>
        <ListItem>6</ListItem>
        <ListItem>7</ListItem>
        <ListItem>8</ListItem>
        <ListItem>9</ListItem>
        <ListItem>10</ListItem>
      </List>
    </>
  </Container>
);
const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: ${({ children }) =>
    `repeat(${React.Children.count(children)}, 25px 1fr)`};
  grid-auto-rows: 25px 1fr;
  background-color: #252526;
  color: #c9c0ae;
  width: 100%;
  height: 100%;
  max-height: 100%;
  top: 0;
  font-size: 0.9em;
`;

const Title = styled.div`
  width: 100%;
  height: 100%;
  background-color: #383838;
  border: #383838 solid;
  border-width: 0 8px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: auto auto;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
`;

const List = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

const ListItem = styled.div`
  padding: 4px 0;
  padding-left: 16px;
  &:hover {
    background-color: #3f3f46;
  }
`;
