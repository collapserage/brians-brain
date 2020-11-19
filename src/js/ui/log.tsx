import React from 'react';
import styled from 'styled-components';
import { GameLog } from '../game';
import { Card } from './common.styled';
import { SectionHeader, SectionBody } from './board.styled';

type LogProps = {
  log: GameLog;
};

const Table = styled.table`
  width: 100%;

  td:nth-child(2) {
    min-width: 3rem;
    text-align: right;
  }
`;

export function Log({ log }: LogProps) {
  return (
    <Card>
      <SectionHeader>Log</SectionHeader>
      <SectionBody>
        <Table>
          <tr>
            <td>Generation:</td>
            <td>{log.generation}</td>
          </tr>
          <tr>
            <td>Cells:</td>
            <td>{log.cells}</td>
          </tr>
          <tr>
            <td>Repaints:</td>
            <td>{log.repaints}</td>
          </tr>
          <tr>
            <td>Drawing time:</td>
            <td>
              {log.calculationTime}
              ms
            </td>
          </tr>
          <tr>
            <td>Calculation time:</td>
            <td>
              {log.drawingTime}
              ms
            </td>
          </tr>
          <tr>
            <td>FPS:</td>
            <td>{log.fps}</td>
          </tr>
          <tr>
            <td>Average FPS:</td>
            <td>{Math.round(log.fpsTotal / log.generation)}</td>
          </tr>
        </Table>
      </SectionBody>
    </Card>
  );
}
