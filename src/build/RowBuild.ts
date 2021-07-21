import { BaseBuild, Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { CellBuild } from './CellBuild';
import { ExcelBuild } from './ExcelBuild';

export interface RowMeta {
  /**
   * 行宽度
   */
  width?: number;
  /**
   * 行高度
   */
  height?: number;
  /**
   * 行头
   */
  title?: string;
  /**
   * 行数
   */
  index?: number;
}

type RowMetaKey = keyof RowMeta;

export interface RowBuildArgs extends BaseBuildArgs {
  sheet: SheetBuild;

  excelBuild: ExcelBuild;
}

export class RowBuild extends BaseBuild<RowMeta> {

  private sheet: SheetBuild;

  private cells: CellBuild[];

  private excelBuild: ExcelBuild;

  public constructor(args: RowBuildArgs) {
    super(args);
  }

  /**
   * 初始化数据
   * @param args 
   */
  protected initData(args: RowBuildArgs) {
    this.sheet = args.sheet;
    this.cells = [];
    this.excelBuild = args.excelBuild;
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
  }

  /**
   * 转换行头样式
   */
  public toStyle() {
    const { excelBuild } = this;
    const theme = excelBuild.getTheme();
    const style = {
      width: `${theme.rowHeadWidth}px`,
      height: `${theme.rowHeadHeight}px`,
    };
    return style;
  }

  /**
   * 获取行高
   */
  public getHeight() {
    const theme = this.excelBuild.getTheme();
    const height = this.metaInfo.height || theme.rowHeadHeight || 0;
    return height;
  }

  /**
   * 获取行头列宽
   * @returns 
   */
  public getWidth() {
    const theme = this.excelBuild.getTheme();
    const width = this.metaInfo.width || theme.rowHeadWidth || 0;
    return width;
  }

  /**
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: RowMetaKey, value: any) {
    const isPreview = this.excelBuild.getIsPreview();
    const undoManage = this.excelBuild.getUndoManage();
    const oldValue = this.metaInfo[key];
    if (oldValue == value) {
      return;
    }
    undoManage.beginUpdate();
    try {
      if (isPreview) {
        undoManage.storeUndoItem({
          c: this,
          p: key,
          op: Operate.Modify,
          v: value,
          isPreview
        });
      } else {
        undoManage.storeUndoItem({
          c: this,
          p: key,
          op: Operate.Modify,
          v: value,
          ov: oldValue
        });
        super.setProperty(key, value);
      }
    } finally {
      undoManage.endUpdate();
    }
  }

  /**
   * 获取行头样式
   * @returns 
   */
  public getThemeClassName() {
    const excelBuild = this.excelBuild;
    const themeStyle = excelBuild.getThemeStyle();
    return themeStyle.getRowHeadThemeClass();
  }

  /**
   * 获取行头样式
   */
  public getClassName() {

  }

  /**
   * 获取行头文本索引
   * row索引从0开始
   */
  public getIndex() {
    const title = this.metaInfo.title;
    if (title) {
      return title;
    }
    return this.metaInfo.index + 1;
  }

  /**
   * 获取行索引
   * @returns 
   */
  public getRow() {
    return this.metaInfo.index;
  }

  public getCells() {
    return this.cells;
  }

  /**
   * 获取指定列的单元格
   * @param col 
   */
  public getCell(col: number) {
    return this.cells[col];
  }

  /**
   * 替换单元格
   * 合并操作和拆分操作会用到
   * @param col 
   */
  public replaceCell(col: number, cell: CellBuild) {
    if (this.cells[col] == cell) {
      return;
    }
    const undoManage = this.excelBuild.getUndoManage();
    undoManage.beginUpdate();
    try {
      undoManage.storeUndoItem({
        c: this,
        p: 'merge',
        op: Operate.Modify,
        v: cell,
        i: col,
        ov: this.cells[col]
      });
      this.cells[col] = cell;
    } finally {
      undoManage.endUpdate();
    }
  }

  /**
   * 获取表格
   * @returns 
   */
  public getSheetBuild() {
    return this.sheet;
  }

  restoreUndoItem(undoItem: UndoItem) {
    const op = undoItem.op;
    const { sheet } = this;
    switch (op) {
      case Operate.Add:

        break;
      case Operate.Remove:
        break;
      case Operate.Modify:
        const key = undoItem.p;
        const value = this.excelBuild.getUndoRedoValue(undoItem);
        if (value instanceof CellBuild) {
          const i = undoItem.i;
          this.replaceCell(i, value);
        } else {
          if ((key as string).indexOf('.') > -1) {
            super.setDeepProperty(key, value);
          } else {
            super.setProperty(key as any, value);
          }
        }
        break;
    }
  }
}