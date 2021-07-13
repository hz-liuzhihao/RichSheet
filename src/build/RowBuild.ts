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
    this.sheet = args.sheet;
    this.cells = [];
    this.excelBuild = args.excelBuild;
  }

  /**
   * 初始化数据
   * @param args 
   */
  protected initData(args: RowBuildArgs) {

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
   * 获取列宽
   */
   public getHeight() {
    const theme = this.excelBuild.getTheme();
    const height = this.metaInfo.height || theme.rowHeadHeight;
    return height;
  }

  /**
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: RowMetaKey, value: any) {
    const isPreview = this.excelBuild.getIsPreview();
    const undoManage = this.excelBuild.getUndoManage();
    undoManage.beginUpdate();
    try {
      if (isPreview) {
        undoManage.storeUndoItem({
          c: this,
          p: key,
          op: Operate.Preview,
          v: value
        });
      } else {
        const oldValue = this.metaInfo[key];
        undoManage.storeUndoItem({
          c: this,
          p: key,
          op: Operate.Modify,
          v: oldValue
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
   * 获取行头
   */
  public getIndex() {
    const title = this.metaInfo.title;
    if (title) {
      return title;
    }
    return this.cells[0].getProperty('row') + 1;
  }

  public getCells() {
    return this.cells;
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
        const value = undoItem.v;
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key as any, value);
        }
        break;
    }
  }
}