import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { BriansBrainGameBoard } from './js/ui/board';

render((
  <ThemeProvider
    theme={{
      accent: 'rgba(108, 86, 123, 0.9)',
      main: 'rgba(228, 214, 207, 0.8)',
      background: '#ddd',
      light: '#eee',
      dark: '#333',
      border: '#777',
      borderRadius: '3px',
    }}
  >
    <BriansBrainGameBoard
      horizontalSize={300}
      verticalSize={200}
      cellSize={3}
      borderSize={0}
      logPrintDelay={250}
      colors={['white', 'pink', 'firebrick', 'gray']}
    />
  </ThemeProvider>
), document.querySelector('main'));
