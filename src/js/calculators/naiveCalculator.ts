import { NaiveNeighborCounter } from './naiveNeighborCounter';
import { CellState } from '../cellState';

export class BriansBrainNaiveCalculator {
  private neighborCounter: NaiveNeighborCounter = new NaiveNeighborCounter();

  public run(board: number[][], horizontalSize: number, verticalSize: number) {
    const boardCopy = board.map((column) => column.slice());

    this.neighborCounter.reset(boardCopy, horizontalSize, verticalSize);

    for (let i = 0; i < horizontalSize; i += 1) {
      for (let j = 0; j < verticalSize; j += 1) {
        // key rule of the game, spawn a new young cell if there are 2 neighboring young cells
        if (
          boardCopy[i][j] === CellState.Off
          && this.neighborCounter.countYoungNeighbors(i, j) === 2
        ) {
          boardCopy[i][j] = CellState.Young;
        } else if (boardCopy[i][j] === CellState.Young) { // age young cell
          boardCopy[i][j] = CellState.Old;
        } else { // remove old cell
          boardCopy[i][j] = CellState.Off;
        }
      }
    }

    return boardCopy;
  }
}
