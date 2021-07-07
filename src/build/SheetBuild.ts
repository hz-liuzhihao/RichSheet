import { BaseBuild, Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import { RowBuild, RowMeta } from './RowBuild';
import { ColBuild, ColMeta } from './ColBuild';
import { CellMeta, CellBuild } from './CellBuild';

/**
 * 表格元数据
 */
export interface SheetMeta {
  // 默认行高度
  defaultRowHeight?: number;
  // 默认列宽度
  defaultColWidth?: number;
  defaultRows?: number;
  defaultCols?: number;

  cells?: CellMeta[];

  rows?: RowMeta[];

  cols?: ColMeta[];

  title?: string;
}

type SheetMetaKey = keyof SheetMeta;

export interface SheetBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

/**
 * 表格数据层
 */
export class SheetBuild extends BaseBuild<SheetMeta> {

  private excelBuild: ExcelBuild;

  private rows: RowBuild[];

  private cols: ColBuild[];

  public constructor(args: SheetBuildArgs) {
    super(args);
  }

  protected initData(args: SheetBuildArgs) {
    this.excelBuild = args.excelBuild;
    this.rows = [];
    this.cols = [];
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
    const { cells = [], rows = [], cols = [], defaultRows, defaultCols } = this.metaInfo;
    // 获取行数,先获取本表格的配置再获取顶级配置
    const rowLines = defaultRows || this.excelBuild.getProperty('defaultRows') || 20;
    const colLines = defaultCols || this.excelBuild.getProperty('defaultCols') || 20;
    const cellMap: {
      [key: string]: CellMeta;
    } = {};
    // 
    cells.forEach(cell => {
      cellMap[`${cell.row}${cell.col}`] = cell;
    });
    // 初始化行列
    for (let row = 0; row < rowLines; row++) {
      // 当行未初始化时,进行初始化
      if (this.rows[row] == null) {
        this.rows[row] = new RowBuild({
          metaInfo: rows[row],
          sheet: this
        });
      }
      for (let col = 0; col < colLines; col++) {
        // 当列未初始化时,进行初始化
        if (this.cols[col] == null) {
          this.cols[col] = new ColBuild({
            metaInfo: cols[col],
            sheet: this
          });
        }
        let cell = cellMap[`${row}${col}`];
        // 对单元格进行初始化
        if (!cell) {
          cell = {
            row,
            col
          }
        };
        new CellBuild({
          row: this.rows[cell.row],
          col: this.cols[cell.col],
          metaInfo: cell
        });
      }
    }
  }

  /**
   * 获取行数据
   * @returns 
   */
  public getRows() {
    return this.rows;
  }

  /**
   * 获取列数据
   * @returns 
   */
  public getCols() {
    return this.cols;
  }

  /** @implements */
  public restoreUndoItem(undoItem: UndoItem<SheetMeta>) {
    const op = undoItem.op;
    switch (op) {
      case Operate.Add:
        const c = undoItem.c;
        const i = undoItem.i;
        break;
      case Operate.Remove:
        break;
      case Operate.Modify:
        const key = undoItem.p;
        const value = undoItem.v;
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key, value);
        }
        break;
    }
  }
}