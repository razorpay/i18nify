import styled from 'styled-components';

export const Background = styled.div(({ theme }) => {
  return `
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.surface.background.primary.subtle};
`;
});
