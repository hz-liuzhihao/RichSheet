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

interface Selector {
  // 选中的开始行
  rowStart: number;
  // 选中的结束行
  rowEnd: number;
  // 选中的开始列
  colStart: number;
  // 选中的结束列
  colEnd: number;
}

interface Selectors {
  focusCell?: CellBuild;

  selectors?: Selector[];
}

/**
 * 表格数据层
 */
export class SheetBuild extends BaseBuild<SheetMeta> {

  private excelBuild: ExcelBuild;

  private rows: RowBuild[];

  private cols: ColBuild[];

  private selector: Selectors;

  public constructor(args: SheetBuildArgs) {
    super(args);
  }

  protected initData(args: SheetBuildArgs) {
    this.excelBuild = args.excelBuild;
    this.rows = [];
    this.cols = [];
    this.selector = {
      focusCell: null,
      selectors: []
    };
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
          sheet: this,
          excelBuild: this.excelBuild
        });
      }
      for (let col = 0; col < colLines; col++) {
        // 当列未初始化时,进行初始化
        if (this.cols[col] == null) {
          this.cols[col] = new ColBuild({
            metaInfo: cols[col],
            sheet: this,
            excelBuild: this.excelBuild
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
          metaInfo: cell,
          excelBuild: this.excelBuild
        });
      }
    }
  }

  /**
   * 获取表格宽度
   * @returns 
   */
  public getTableWidth() {
    const tableWidth = this.cols.reduce((total, item) => total + item.getProperty('width'), 0);
    const rowWidth = this.rows[0].getWidth() || 0;
    return tableWidth + rowWidth;
  }

  /**
   * 获取左上角样式
   * @returns 
   */
  public getCornerClass() {
    const excelBuild = this.excelBuild;
    const themeStyle = excelBuild.getThemeStyle();
    return themeStyle.getColHeadThemeClass();
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

  /**
   * 选中单元格
   * startCell一定是focusCell
   */
  public doSelect(startCell: CellBuild, endCell: CellBuild, isCtrl = false) {
    const startRow = startCell.getProperty('row');
    const startCol = startCell.getProperty('col');
    const endRow = endCell.getProperty('row');
    const endCol = endCell.getProperty('col');
    let rowStart;
    let rowEnd;
    let colStart;
    let colEnd;
    // 将选中的cell重新排行列
    if (startRow > endRow) {
      rowStart = endRow;
      rowEnd = startRow;
    } else {
      rowStart = startRow;
      rowEnd = endRow;
    }
    if (startCol > endCol) {
      colStart = endCol;
      colEnd = startCol;
    } else {
      colStart = startCol;
      colEnd = endCol;
    }
    const undoManage = this.excelBuild.getUndoManage();
    const selector = { ...this.selector }
    const info: Selector = {
      rowStart,
      colStart,
      rowEnd,
      colEnd
    };
    if (this.selector.selectors) {
      selector.selectors = [...this.selector.selectors];
    }
    undoManage.beginUpdate();
    try {
      undoManage.storeUndoItem({
        c: this,
        op: Operate.Query,
        p: 'select',
        v: this.selector
      });
      if (isCtrl) {
        selector.selectors.push(info);
      } else {
        selector.selectors = [info];
      }
      selector.focusCell = startCell;
      this.selector = selector;
    } finally {
      undoManage.endUpdate();
    }
  }

  /**
   * 是否已经选中
   * @param cell 
   */
  public isSelect(cell: CellBuild) {
    const selectors = this.selector.selectors;
    const cellRow = cell.getRow();
    const cellCol = cell.getCol();
    return selectors.some(item => {
      const { rowStart, rowEnd, colStart, colEnd } = item;
      if (cellRow >= rowStart && cellRow <= rowEnd && cellCol >= colStart && cellCol <= colEnd) {
        return true;
      }
    });
  }

  /**
   * 获取指定行列的单元格数据层
   * @param row 
   * @param col 
   */
  public getCell(row: number, col: number) {
    const rowBuild = this.rows[row];
    return rowBuild.getCells()[col];
  }

  /**
   * 合并单元格
   */
  public mergeCell() {
    const selector = this.selector;
    const selectors = selector.selectors;
    let isSplit = false;
    selectors.forEach(item => {
      const { rowStart, colStart, rowEnd, colEnd } = item;
      // 当只有一个单元格时没有合并单元格的概念
      if (rowStart == rowEnd && colStart == colEnd) {
        return;
      }
      for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
          const cellBuild = this.getCell(i, j);
          isSplit = true;
        }
      }
    })
  }

  /**
   * 获取选择数据
   * @returns 
   */
  public getSelector() {
    return this.selector;
  }

  /**
   * 返回主题
   * @returns 
   */
  public getTheme() {
    return this.excelBuild.getThemeStyle();
  }

  /** @implements */
  public restoreUndoItem(undoItem: UndoItem) {
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
        const value = this.excelBuild.getUndoRedoValue(undoItem);
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key as any, value);
        }
        break;
    }
  }
}