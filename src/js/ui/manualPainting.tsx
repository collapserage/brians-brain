import React from 'react';
import { CellState } from '../cellState';
import { Button, Buttons, Card } from './common.styled';
import { SectionHeader, SectionBody } from './board.styled';

type ManualPaintingSettingProps = {
  paintMode: CellState | null;
  setPaintMode: (paintMode: CellState | null) => void;
};

export function ManualPainting({ paintMode, setPaintMode }: ManualPaintingSettingProps) {
  function changePaintMode(paintModeValue: CellState) {
    const newPaintMode = paintMode === paintModeValue ? null : paintModeValue;

    setPaintMode(newPaintMode);
  }

  return (
    <Card>
      <SectionHeader>Manual painting</SectionHeader>
      <SectionBody>
        <Buttons>
          <Button
            type="button"
            className={paintMode === CellState.Young ? 'pressed' : ''}
            onClick={() => changePaintMode(CellState.Young)}
          >
            Young
          </Button>
          <Button
            type="button"
            className={paintMode === CellState.Old ? 'pressed' : ''}
            onClick={() => changePaintMode(CellState.Old)}
          >
            Old
          </Button>
          <Button
            type="button"
            className={paintMode === CellState.Off ? 'pressed' : ''}
            onClick={() => changePaintMode(CellState.Off)}
          >
            Off
          </Button>
        </Buttons>
      </SectionBody>
    </Card>
  );
}
