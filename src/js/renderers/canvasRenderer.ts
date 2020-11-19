import { CellState } from '../cellState';

export class BriansBrainCanvasRenderer {
  private offscreenCanvas: HTMLCanvasElement = document.createElement('canvas');
  private offscreenCtx: CanvasRenderingContext2D = this.offscreenCanvas.getContext('2d')!;
  private gridCanvas: HTMLCanvasElement = document.createElement('canvas');
  private gridCtx: CanvasRenderingContext2D = this.gridCanvas.getContext('2d')!;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private colors: string[],
    private horizontalSize: number,
    private verticalSize: number,
    private cellSize: number,
    private borderSize: number,
  ) {
  }

  public setHorizontalSize(horizontalSize: number) {
    this.horizontalSize = horizontalSize;
    this.init();
  }

  public setVerticalSize(verticalSize: number) {
    this.verticalSize = verticalSize;
    this.init();
  }

  public setCellSize(cellSize: number) {
    this.cellSize = cellSize;
    this.init();
  }

  public setBorderSize(lineWidth: number) {
    this.borderSize = lineWidth;
    this.init();
  }

  public init() {
    this.canvas.width = this.cellSize * this.horizontalSize + this.borderSize;
    this.canvas.height = this.cellSize * this.verticalSize + this.borderSize;

    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;

    this.gridCanvas.width = this.canvas.width;
    this.gridCanvas.height = this.canvas.height;

    this.ctx.fillStyle = this.colors[this.colors.length - 1];
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGridCanvas();
  }

  public draw(board: number[][], { forceRepaint }: { forceRepaint?: boolean } = {}) {
    let repaints = 0;

    this.offscreenCtx.drawImage(this.gridCanvas, 0, 0);

    for (let i = 0; i < this.horizontalSize; i += 1) {
      for (let j = 0; j < this.verticalSize; j += 1) {
        if (forceRepaint === true || board[i][j]) {
          repaints += 1;
          this.drawCell(i, j, board[i][j], this.offscreenCtx);
        }
      }
    }

    this.ctx.drawImage(this.offscreenCanvas, 0, 0);

    return repaints;
  }

  public drawCell(x: number, z: number, value: number, ctx: CanvasRenderingContext2D = this.ctx) {
    ctx.fillStyle = this.colors[value];
    ctx.fillRect(
      this.borderSize + x * this.cellSize,
      this.borderSize + z * this.cellSize,
      this.cellSize - this.borderSize,
      this.cellSize - this.borderSize,
    );
  }

  private drawGridCanvas() {
    this.gridCtx.fillStyle = this.colors[CellState.Off];

    for (let i = 0; i < this.horizontalSize; i += 1) {
      for (let j = 0; j < this.verticalSize; j += 1) {
        this.gridCtx.fillRect(
          this.borderSize + i * this.cellSize,
          this.borderSize + j * this.cellSize,
          this.cellSize - this.borderSize,
          this.cellSize - this.borderSize,
        );
      }
    }
  }
}
