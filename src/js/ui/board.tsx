import React, { useEffect, useState, useRef } from 'react';
import { BriansBrainGame, GameLog } from '../game';
import { CellState } from '../cellState';
import { Log } from './log';
import { ManualPainting } from './manualPainting';
import {
  GlobalStyle, Button, Buttons, Canvas, Card, Input,
} from './common.styled';
import {
  Sidebar, SectionHeader, SectionBody, SettingField, SettingTitle,
} from './board.styled';

const getItem = (key: string) => parseInt(localStorage.getItem(key) || '', 10);

type BriansBrainGameBoardProps = {
  horizontalSize: number;
  verticalSize: number;
  cellSize: number;
  borderSize: number;
  logPrintDelay: number;
  colors: string[];
};

export function BriansBrainGameBoard({
  horizontalSize: defaultHorizontalSize,
  verticalSize: defaultVerticalSize,
  cellSize: defaultCellSize,
  borderSize: defaultBorderSize,
  logPrintDelay,
  colors,
}: BriansBrainGameBoardProps) {
  const [horizontalSize, setHorizontalSize] = useState(getItem('horizontal-size') || defaultHorizontalSize);
  const [verticalSize, setVerticalSize] = useState(getItem('vertical-size') || defaultVerticalSize);
  const [cellSize, setCellSize] = useState(getItem('cell-size') || defaultCellSize);
  const [borderSize, setBorderSize] = useState(getItem('border-size') || defaultBorderSize);
  const [game, setGame] = useState<BriansBrainGame | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [log, setLog] = useState<GameLog | null>(null);
  const [paintMode, setPaintMode] = useState<CellState | null>(null);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas.current) {
      setGame(new BriansBrainGame(
        canvas.current,
        colors,
        horizontalSize,
        verticalSize,
        cellSize,
        borderSize,
        () => setRunning(true),
        () => setRunning(false),
        (newLog) => setLog({ ...newLog }),
        logPrintDelay,
      ));
    }
  }, []);

  function toggleBorders() {
    const newBorderSize = borderSize ? 0 : 1;

    localStorage.setItem('border-size', newBorderSize.toString());
    setBorderSize(newBorderSize);
    game!.setBorderSize(newBorderSize);
  }

  function applySize(event: React.FormEvent) {
    event.preventDefault();

    localStorage.setItem('horizontal-size', horizontalSize.toString());
    localStorage.setItem('vertical-size', verticalSize.toString());
    localStorage.setItem('cell-size', cellSize.toString());

    game!.setBoardSize(horizontalSize, verticalSize);
    game!.setCellSize(cellSize);
  }

  function paint({ pageX, pageY, currentTarget }: React.MouseEvent<HTMLCanvasElement>) {
    if (paintMode !== null) {
      game!.changeCellState(
        pageX - currentTarget.offsetLeft,
        pageY - currentTarget.offsetTop,
        paintMode,
      );
    }
  }

  function startPainting(event: React.MouseEvent<HTMLCanvasElement>) {
    setIsPainting(true);
    paint(event);
  }

  function continuePainting(event: React.MouseEvent<HTMLCanvasElement>) {
    if (isPainting) {
      paint(event);
    }
  }

  return (
    <>
      <GlobalStyle />

      <Canvas
        ref={canvas}
        onMouseDown={startPainting}
        onMouseMove={continuePainting}
        onMouseUp={() => setIsPainting(false)}
      />

      {game && (
        <Sidebar>
          <Card>
            <SectionHeader>Controls</SectionHeader>
            <SectionBody>
              <Buttons>
                <Button type="button" onClick={() => game.run()}>{running ? 'Stop' : 'Run'}</Button>
                <Button type="button" onClick={() => game.runSungleState()}>Next</Button>
              </Buttons>
              <Buttons>
                <Button type="button" onClick={() => game.initRandomized()}>Randomize</Button>
                <Button type="button" onClick={() => game.initEmpty()}>Clear</Button>
              </Buttons>
            </SectionBody>
          </Card>

          <ManualPainting paintMode={paintMode} setPaintMode={setPaintMode} />

          <Card>
            <SectionHeader>Settings</SectionHeader>
            <SectionBody as="form" onSubmit={applySize}>
              <SettingField>
                <SettingTitle>Field width</SettingTitle>
                <Input
                  id="sizeX"
                  type="number"
                  defaultValue={horizontalSize}
                  onChange={(event) => setHorizontalSize(parseInt(event.target.value, 10 || 0))}
                />
              </SettingField>
              <SettingField>
                <SettingTitle>Field height</SettingTitle>
                <Input
                  id="sizeY"
                  type="number"
                  defaultValue={verticalSize}
                  onChange={(event) => setVerticalSize(parseInt(event.target.value, 10 || 0))}
                />
              </SettingField>
              <SettingField>
                <SettingTitle>Cell size</SettingTitle>
                <Input
                  id="cellSize"
                  type="number"
                  defaultValue={cellSize}
                  onChange={(event) => setCellSize(parseInt(event.target.value, 10) || 0)}
                />
              </SettingField>
              <Buttons>
                <Button type="button" onClick={() => toggleBorders()}>Borders</Button>
                <Button type="submit">Apply</Button>
              </Buttons>
            </SectionBody>
          </Card>

          {!!log && !!log.generation && <Log log={log} />}
        </Sidebar>
      )}
    </>
  );
}
