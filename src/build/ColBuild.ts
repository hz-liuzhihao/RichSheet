import { BaseBuild, Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { CellBuild } from './CellBuild';
import { getColNameByOrder } from '../utils/common';
import { ExcelBuild } from './ExcelBuild';

export interface ColMeta {
  /**
   * 列头的宽度
   */
  width: number;
  /**
   * 列头的高度
   */
  height: number;
  /**
   * 列头文本
   */
  title: string;
  /**
   * 序号
   */
  index: number;
}

type ColMetaKey = keyof ColMeta;

export interface ColBuildArgs extends BaseBuildArgs {
  sheet: SheetBuild;

  excelBuild: ExcelBuild;
}

export class ColBuild extends BaseBuild<ColMeta> {

  private cells: CellBuild[];

  private sheet: SheetBuild;

  private excelBuild: ExcelBuild;

  public constructor(args: ColBuildArgs) {
    super(args);
  }

  protected initData(args: ColBuildArgs) {
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
   * 获取行头
   */
  public getIndex() {
    const title = this.metaInfo.title;
    if (title) {
      return title;
    }
    const col = this.cells[0].getProperty('col');
    return getColNameByOrder(col + 1);
  }

  /**
   * 获取列号
   * @returns 
   */
  public getColNumber() {
    return this.cells[0].getProperty('col');
  }

  /**
   * 获取列宽
   */
  public getWidth() {
    const theme = this.excelBuild.getTheme();
    const width = this.metaInfo.width || theme.colHeadWidth || 0;
    return width;
  }

  /**
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: ColMetaKey, value: any) {
    const isPreview = this.excelBuild.getIsPreview();
    const undoManage = this.excelBuild.getUndoManage();
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

  public getCells() {
    return this.cells;
  }

  /**
   * 获取行头样式
   * @returns 
   */
  public getThemeClassName() {
    const excelBuild = this.excelBuild;
    const themeStyle = excelBuild.getThemeStyle();
    return themeStyle.getColHeadThemeClass();
  }

  /**
   * 转换列头样式
   */
  public toStyle() {
    const { excelBuild, metaInfo } = this;
    const theme = excelBuild.getTheme();
    const { width, height } = metaInfo;
    const style = {
      width: `${width || theme.colHeadWidth}px`,
      height: `${height || theme.colHeadHeight}px`,
    };
    return style;
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
    switch (op) {
      case Operate.Add:
        break;
      case Operate.Remove:
        break;
      case Operate.Modify:
        const key = undoItem.p;
        const value = undoItem.v;
        if ((key as string).indexOf('.') > -1) {
          super.setDeepProperty(key, value);
        } else {
          super.setProperty(key as any, value);
        }
        break;
    }
  }
}