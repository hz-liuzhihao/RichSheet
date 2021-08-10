/**
 * excel所有行为接口,ExcelBuild必须实现它
 */
export interface IExcelBehavior {
  /**
   * 添加行
   * 如果未选中行则添加到最后此时count参数有效
   * 如果有选中行则添加对应的行的行数此时count参数无效
   */
  addRow?: (count: number) => void;

  /**
   * 添加列
   * 如果未选中列则添加到最后此时count参数无效
   * 如果有选中列则添加对应的行数此时count参数无效
   */
  addCol?: (count: number) => void;

  /**
   * 删除行,此时必须有选中行
   */
  deleteRow?: () => void;

  /**
   * 删除列,此时必须有选中列
   */
  deleteCol?: () => void;

  /** 合并单元格 */
  mergeCell?: () => void;

  /**
   * 进行undo操作
   */
  undo?: () => void;

  /**
   * 进行redo操作
   */
  redo?: () => void;

  /**
   * 保存元数据
   */
  save?: () => void;

  /**
   * 是否可以undo
   */
  canUndo?: () => boolean;

  /**
   * 是否可以redo
   */
  canRedo?: () => boolean;

  /**
   * 是否可以保存
   */
  canSave?: () => boolean;

  /**
   * 行为改变监听
   */
  addBahaviorChangeListener?: (func: Function) => void;

  /**
   * 字体颜色
   */
  setColor?: (color: string) => void;

  /**
   * 获取当前框选单元格的字体颜色,如果有多个则返回数组
   */
  getColor?: () => string[];

  /**
   * 背景颜色
   */
  setBackgroundColor?: (color: string) => void;

  /**
   * 获取背景颜色列表
   */
  getBackgroundColor?: () => string[];

  /**
   * 水平位置
   */
  setTextAlign?: (textAlign: string) => void;

  /**
   * 获取水平位置
   */
  getTextAlign?: () => string[];

  /**
   * 垂直位置
   */
  setVerticalAlign?: (verticalAlign: string) => void;

  /**
   * 获取垂直位置
   */
  getVerticalAlign?: () => string[];

  /**
   * 字体大小
   */
  setFontSize?: (fontSize: number) => void;

  /**
   * 获取字体大小
   */
  getFontSize?: () => number[];

  /**
   * 字体粗细
   */
  setFontWeight?: (fontWeight: number) => void;

  /**
   * 获取字体粗细
   */
  getFontWeight?: () => number[];

  /**
   * 字体样式,斜体
   */
  setFontStyle?: (fontStyle: string) => void;

  /**
   * 获取字体大小
   */
  getFontStyle?: () => string[];

  /**
   * 字体
   */
  setFontFamily?: (fontFamily: string) => void;

  /**
   * 获取字体
   */
  getFontFamily?: () => string[];

  /**
   * 文本装饰样式
   */
  setTextDecorationStyle?: (textDecorationStyle: string) => void;

  /**
   * 获取文本装饰样式
   */
  getTextDecorationStyle?: () => string[];

  /**
   * 文本装饰线类型,下划线
   */
  setUnderline?: (underline: string) => void;

  /**
   * 文本装饰线类型,上划线
   */
  setOverline?: (overline: string) => void;

  /**
   * 文本装饰线类型,删除线
   */
  setLineThrough?: (lineThrough: string) => void;

  /**
   * 文本装饰线颜色
   */
  setTextDecorationColor?: (textDecorationColor: string) => void;

  /**
   * 获取文本装饰线颜色
   */
  getTextDecorationColor?: () => string[];

  /**
   * 设置是否自动换行
   */
  setWhiteSpace?: (whiteSpace: string) => void;

  /**
   * 设置缩进,起步12,步进2
   */
  setTextIndent?: (textIndent?: number) => void;


  /**
   * 获取当前styleMap
   */
  getCurrentStyleMap?: () => JSONObject;

}

export interface AbsToolbarArgs {
  excelBehavior: IExcelBehavior;
}

/**
 * 工具栏抽象类
 */
export abstract class AbsToolbar {

  private excelBehavior: IExcelBehavior;

  public constructor(args: AbsToolbarArgs) {
    this.excelBehavior = args.excelBehavior;
  }
}

export class DefaultToolBar extends AbsToolbar {

}