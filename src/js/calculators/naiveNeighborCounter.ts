import { CellState } from '../cellState';

export class NaiveNeighborCounter {
  private board: number[][] = [];

  private horizontalSize: number = 0;
  private verticalSize: number = 0;

  private youngNeighborCount: number = 0;
  private twoRows: number = 0;
  private middleRow: number = 0;
  private oldY: number = 0;

  public reset(board: number[][], horizontalSize: number, verticalSize: number) {
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;

    for (let i = 0; i < board.length; i += 1) {
      this.board[i] = board[i].slice(0);
    }
  }

  public countYoungNeighbors(x: number, y: number) {
    // oldY is used to fix "jumps" over alive cells when optimized algorithm fails
    if (y === 0 || this.oldY !== y - 1) {
      this.youngNeighborCount = 0;
      this.twoRows = 0;
      this.middleRow = 0;

      for (let k = -1; k < 2; k += 1) {
        for (let l = -1; l < 2; l += 1) {
          this.checkNeighbor(x + k, y + l, l);
        }
      }
    } else {
      this.youngNeighborCount = this.twoRows;
      this.twoRows -= this.middleRow;
      this.middleRow = this.twoRows;

      for (let l = -1; l < 2; l += 1) {
        this.checkNeighbor(x + l, y + 1, 1);
      }
    }

    this.oldY = y;

    return this.youngNeighborCount;
  }

  private checkNeighbor(posX: number, posZ: number, row: number) {
    let validatedPosX = posX;
    let validatedPosZ = posZ;

    if (posX < 0) {
      validatedPosX = this.horizontalSize - 1;
    } else if (posX >= this.horizontalSize) {
      validatedPosX = 0;
    }

    if (posZ < 0) {
      validatedPosZ = this.verticalSize - 1;
    } else if (posZ >= this.verticalSize) {
      validatedPosZ = 0;
    }

    if (this.board[validatedPosX][validatedPosZ] === CellState.Young) {
      this.youngNeighborCount += 1;

      if (row > -1) {
        this.twoRows += 1;
      }

      if (row === 0) {
        this.middleRow += 1;
      }
    }
  }
}
