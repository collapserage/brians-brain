import { BriansBrainNaiveCalculator } from './calculators/naiveCalculator';
import { BriansBrainCanvasRenderer } from './renderers/canvasRenderer';
import { CellState } from './cellState';

export type GameLog = Record<'generation' | 'cells' | 'repaints' | 'calculationTime' | 'drawingTime' | 'fps' | 'fpsTotal', number>;

const EMPTY_LOG: GameLog = {
  generation: 0,
  cells: 0,
  repaints: 0,
  calculationTime: 0,
  drawingTime: 0,
  fps: 0,
  fpsTotal: 0,
};

export const CELL_STATE_LENGTH = Object.keys(CellState).length / 2;

export class BriansBrainGame {
  private board: number[][] = [];
  private running: boolean = false;
  private gameLoop: number = 0;
  private logOutputLoop: number = 0;
  private log: GameLog = { ...EMPTY_LOG };

  constructor(
    canvas: HTMLCanvasElement,
    colors: string[],
    private horizontalSize: number,
    private verticalSize: number,
    private cellSize: number,
    private borderSize: number,
    private onStart: () => void,
    private onStop: () => void,
    private outputLog: (log: GameLog) => void,
    private logPrintDelay: number,
    private gameCalculator = new BriansBrainNaiveCalculator(),
    private gameRenderer = new BriansBrainCanvasRenderer(
      canvas,
      canvas.getContext('2d')!,
      colors,
      horizontalSize,
      verticalSize,
      cellSize,
      borderSize,
    ),
  ) {
    this.initRandomized();
  }

  public initRandomized() {
    this.init(() => Math.floor(Math.random() * CELL_STATE_LENGTH));
  }

  public initEmpty() {
    this.init(() => CellState.Off);
  }

  public run() {
    if (!this.running) {
      this.start();
    } else {
      this.stop();
    }
  }

  public runSungleState() {
    this.updateAndDraw();
    this.outputLog(this.log);
  }

  public setBoardSize(horizontalSize: number, verticalSize: number) {
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;

    this.board.length = this.horizontalSize;

    for (let i = 0; i < this.horizontalSize; i += 1) {
      if (!this.board[i]) {
        this.board[i] = new Array(this.verticalSize);
      } else {
        this.board[i].length = this.verticalSize;
      }

      for (let j = 0; j < this.verticalSize; j += 1) {
        if (this.board[i][j] === undefined) {
          this.board[i][j] = CellState.Off;
        }
      }
    }

    this.gameRenderer.setHorizontalSize(horizontalSize);
    this.gameRenderer.setVerticalSize(verticalSize);
    this.gameRenderer.draw(this.board);
  }

  public setCellSize(cellSize: number) {
    this.cellSize = cellSize;
    this.gameRenderer.setCellSize(cellSize);
    this.gameRenderer.draw(this.board);
  }

  public setBorderSize(borderSize: number) {
    this.borderSize = borderSize;
    this.gameRenderer.setBorderSize(borderSize);
    this.gameRenderer.draw(this.board);
  }

  public changeCellState(xPixel: number, zPixel: number, cellState: number) {
    const x = Math.floor(xPixel / this.cellSize);
    const z = Math.floor(zPixel / this.cellSize);

    if (x < 0 || z < 0) {
      return;
    }

    if (xPixel > this.cellSize * this.horizontalSize - this.borderSize) {
      return;
    }

    if (zPixel > this.cellSize * this.verticalSize - this.borderSize) {
      return;
    }

    this.board[x][z] = cellState;
    this.gameRenderer.drawCell(x, z, cellState);
  }

  private init(defaultValueGetter: () => number) {
    if (this.running) {
      this.stop();
    }

    this.log = { ...EMPTY_LOG };

    this.board = Array.from(
      { length: this.horizontalSize },
      () => Array.from({ length: this.verticalSize }, () => defaultValueGetter()),
    );

    this.gameRenderer.init();
    this.gameRenderer.draw(this.board);
  }

  private start() {
    this.running = true;

    this.gameLoop = requestAnimationFrame(() => this.tick());
    this.logOutputLoop = window.setInterval(() => this.outputLog(this.log), this.logPrintDelay);

    this.onStart();
  }

  private stop() {
    this.running = false;

    cancelAnimationFrame(this.gameLoop);
    window.clearInterval(this.logOutputLoop);

    this.onStop();
  }

  private tick() {
    this.updateAndDraw();
    this.gameLoop = requestAnimationFrame(this.tick.bind(this));
  }

  private updateAndDraw() {
    this.log.repaints = 0;

    const calculationTracker = performance.now();
    this.board = this.gameCalculator.run(this.board, this.horizontalSize, this.verticalSize);
    const drawingTracker = performance.now();
    const calculationTime = drawingTracker - calculationTracker;
    this.log.repaints = this.gameRenderer.draw(this.board);
    const drawingTime = performance.now() - drawingTracker;

    this.log.cells = this.board.reduce(
      (cells, column) => cells + column.reduce((columnCells, cell) => Number(!!cell) + columnCells),
      0,
    );

    this.log.generation += 1;
    this.log.calculationTime = calculationTime;
    this.log.drawingTime = drawingTime;
    this.log.fps = Math.round(1000 / (calculationTime + drawingTime));
    this.log.fpsTotal += this.log.fps;

    if (!this.log.cells) {
      this.stop();
    }
  }
}
