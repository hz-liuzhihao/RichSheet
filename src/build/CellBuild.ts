import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';
import { StyleBuild } from './StyleBuild';
import { ExcelBuild } from './ExcelBuild';
import { ExpressionBuild } from './ExpressionBuild';
import { BorderStyleBuild } from './BorderStyleBuild';
import { CellPropertyBuild } from './CellPropertyBuild';

export interface CellMeta {
  // 单元格行
  row?: number;
  // 单元格列
  col?: number;

  colSpan?: number;

  rowSpan?: number;

  index?: number;

  styleIndex?: number;

  expressionIndex?: number;

  cellPropertyIndex?: number;
  // 单元格的值,是指用户在非设计层输入的值
  value?: string;
  // 单元格的文本,包含表达式和非表达式
  text?: string;
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

  private cellPropertyBuild: CellPropertyBuild;

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
    const { styleIndex, expressionIndex, cellPropertyIndex } = this.metaInfo;
    this.styleBuild = this.excelBuild.getStyleBuild(styleIndex);
    this.cellPropertyBuild = this.excelBuild.getCellPropertyBuild(cellPropertyIndex);
    this.expressionBuild = this.excelBuild.getExpressionBuild(expressionIndex);
  }

  /**
   * 设置单元格的样式数据层
   * @param styleBuild 
   * @returns 
   */
  public setStyleBuild(styleBuild: StyleBuild) {
    const oldBuild = this.styleBuild;
    if (oldBuild == styleBuild) {
      return;
    }
    const undoManage = this.excelBuild.getUndoManage();
    undoManage.beginUpdate();
    try {
      oldBuild && oldBuild.removeCell(this);
      styleBuild && styleBuild.addCell(this);
      this.styleBuild = styleBuild;
      undoManage.storeUndoItem({
        c: this,
        op: Operate.Modify,
        p: 'style',
        v: styleBuild,
        ov: oldBuild,
      });
    } finally {
      undoManage.endUpdate();
    }
  }

  /**
   * 设置单元格的属性数据层
   * @param cellProperty 
   * @returns 
   */
  public setCellPropertyBuild(cellProperty: CellPropertyBuild) {
    if (this.cellPropertyBuild == cellProperty) {
      return;
    }
    this.cellPropertyBuild.removeCell(this);
    cellProperty.addCell(this);
    this.cellPropertyBuild = cellProperty;
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
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: CellMetaKey, value: any) {
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
   * 获取单元格样式数据层
   * @returns 
   */
  public getStyleBuild() {
    return this.styleBuild;
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
    return this.row.getIndex();
  }

  /**
   * 获取列
   * @returns 
   */
  public getCol() {
    return this.col.getIndex();
  }

  /**
   * 获取跨行
   * @returns 
   */
  public getRowSpan() {
    return this.metaInfo.rowSpan || 1;
  }

  /**
   * 获取跨列
   * @returns 
   */
  public getColSpan() {
    return this.metaInfo.colSpan || 1;
  }

  /** @override */
  public toJSON() {
    const result = super.toJSON() as CellMeta;
    result.row = this.getRow();
    result.col = this.getCol();
    if (this.styleBuild) {
      result.styleIndex = this.styleBuild.getIndex() || 0;
    }
    return result;
  }

  /**
   * 处理单元格输入值
   * @param value 
   */
  public inputValue(value: string) {
    const isDesign = this.excelBuild.isDesign();
    // 如果是设计层
    if (isDesign) {
      this.setProperty('text', value);
    } else {
      this.setProperty('value', value);
    }
  }

  public restoreUndoItem(undoItem: UndoItem) {
    const op = undoItem.op;
    switch (op) {
      case Operate.Add:
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