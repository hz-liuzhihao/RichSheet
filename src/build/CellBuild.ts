import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';
import { StyleBuild } from './StyleBuild';
import { ExcelBuild } from './ExcelBuild';
import { ExpressionBuild } from './ExpressionBuild';
import { BorderStyleBuild } from './BorderStyleBuild';

export interface CellMeta {
  /**
   * 单元格扩展属性
   */
  extend?: JSONObject;

  colSpan?: number;

  rowSpan?: number;

  row: number;

  col: number;

  index?: number;

  styleIndex?: number;

  expressionIndex?: number;
}

export interface CellBuildArgs extends BaseBuildArgs {
  row: RowBuild;

  col: ColBuild;

  excelBuild: ExcelBuild;
}

type CellMetaKey = keyof CellMeta;

export class CellBuild extends BaseBuild<CellMeta> {

  private row: RowBuild;

  private col: ColBuild;

  private borderStyleBuild: BorderStyleBuild;

  private styleBuild: StyleBuild;

  private expressionBuild: ExpressionBuild;

  private excelBuild: ExcelBuild;

  public constructor(args: CellBuildArgs) {
    super(args);
  }

  protected initData(args: CellBuildArgs) {
    this.row = args.row;
    this.col = args.col;
    this.excelBuild = args.excelBuild;
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
    // 在行列中记录单元格
    const { row, col, styleIndex } = this.metaInfo;
    this.styleBuild = this.excelBuild.getStyleBuild(styleIndex);
    this.row.getCells()[col] = this;
    this.col.getCells()[row] = this;
  }

  /**
   * 设置单元格的样式数据层
   * @param styleBuild 
   * @returns 
   */
  public setStyleBuild(styleBuild: StyleBuild) {
    if (this.styleBuild == styleBuild) {
      return;
    }
    this.styleBuild.removeCell(this);
    styleBuild.addCell(this);
    this.styleBuild = styleBuild;
  }

  /**
   * 设置单元格的边框数据层
   * @param borderStyleBuild 
   * @returns 
   */
  public setBorderStyleBuild(borderStyleBuild: BorderStyleBuild) {
    if (this.borderStyleBuild == borderStyleBuild) {
      return;
    }
    this.borderStyleBuild.removeCell(this);
    borderStyleBuild.addCell(this);
    this.borderStyleBuild = borderStyleBuild;
  }

  /**
   * 获取内联样式
   * @returns 
   */
  public getStyle() {
    if (this.styleBuild == null) {
      return {};
    }
    const style = this.styleBuild.toStyle();
    return style;
  }

  /**
   * 获取主题样式类名
   */
  public getThemeClassName() {
    const themeStyle = this.excelBuild.getThemeStyle();
    return themeStyle.getCellThemeClass();
  }

  /**
   * 获取样式名
   * @returns 
   */
  public getClassName() {
    if (this.styleBuild != null) {
      return this.styleBuild.getClassName();
    }
  }

  public getBorderClassName() {
    if (this.borderStyleBuild != null) {
      return this.borderStyleBuild.getClassName();
    }
  }

  /**
   * 获取表格
   * @returns 
   */
  public getSheetBuild() {
    return this.row.getSheetBuild();
  }

  /**
   * 获取行
   * @returns 
   */
  public getRow() {
    return this.metaInfo.row;
  }

  /**
   * 获取列
   * @returns 
   */
  public getCol() {
    return this.metaInfo.col;
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
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key as any, value);
        }
        break;
    }
  };
}