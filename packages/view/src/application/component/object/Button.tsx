import * as React from "react";
import styled from "styled-components";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

const GhostButton = styled.button`
  color: inherit;
  background: transparent;
`;

interface IconButton {
  icon: string;
  onClick: () => void;
}
export const IconButton: React.SFC<IconButton> = ({ icon, onClick }) => (
  <GhostButton onClick={onClick}>
    <FontAwesomeIcon icon={icon} />
  </GhostButton>
);
