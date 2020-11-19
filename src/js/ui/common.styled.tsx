import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    font: 1rem sans-serif;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    background: ${(props) => props.theme.background};
  }
`;

export const Button = styled.button`
  width: 100%;
  margin: 0 0.2rem;
  padding: 0.4rem 0.8rem;
  background: ${(props) => props.theme.accent};
  border: 0;
  border-radius: ${(props) => props.theme.borderRadius};
  color: ${(props) => props.theme.light};
  font-size: 0.9rem;
  text-transform: uppercase;

  &:hover {
    opacity: .85;
    box-shadow: inset 0 0 0.2rem ${(props) => props.theme.dark};
  }

  &:active, &.pressed {
    box-shadow: inset 0 1px 0.5rem ${(props) => props.theme.dark};
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;

  ${Button} {
    width: 100%;
  }

  & + & {
    margin-top: 1rem;
  }
`;

export const Card = styled.section`
  margin-bottom: 1rem;
  background: ${(props) => props.theme.main};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius};
`;

export const Canvas = styled.canvas`
  border: 1px solid ${(props) => props.theme.border};
`;

export const Input = styled.input`
  width: 4rem;
  padding: 0.3rem;
  font-size: 0.8rem;
`;
