import { BaseBuild, Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { CellBuild } from './CellBuild';
import { getColNameByOrder } from '../utils/common';
import { ExcelBuild } from './ExcelBuild';

export interface ColMeta {
  /**
   * 列头的宽度
   */
  width?: number;
  /**
   * 列头的高度
   */
  height?: number;
  /**
   * 列头文本
   */
  title?: string;
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
  public getColName() {
    const title = this.metaInfo.title;
    if (title) {
      return title;
    }
    const col = this.metaInfo.index;
    return getColNameByOrder(col + 1);
  }

  /**
   * 获取列号
   * @returns 
   */
  public getIndex() {
    return this.metaInfo.index;
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
   * 
   * @returns 获取行头高度
   */
  public getHeight() {
    const theme = this.excelBuild.getTheme();
    const height = this.metaInfo.height || theme.colHeadHeight || 0;
    return height;
  }

  /**
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: ColMetaKey, value: any) {
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
   * 替换单元格
   * 合并操作和拆分操作会用到
   * @param row 
   */
  public replaceCell(row: number, cell: CellBuild) {
    if (this.cells[row] == cell) {
      return;
    }
    const undoManage = this.excelBuild.getUndoManage();
    undoManage.beginUpdate();
    try {
      // 列单元格目前不要记修改后的单元格,因为不触发渲染
      // undoManage.storeUndoItem({
      //   c: this,
      //   p: 'merge',
      //   op: Operate.Modify,
      //   v: cell,
      //   i: row,
      //   ov: this.cells[row]
      // });
      this.cells[row] = cell;
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

  /** @override */
  public toJSON() {

  }
}