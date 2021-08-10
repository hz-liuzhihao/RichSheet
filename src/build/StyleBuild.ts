import { UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import { uniqueId } from 'lodash';
import { addCssRule, deleteCssRule } from '../utils/style';
import { AppConst } from '../config/constant';
import CellPluginBuild from './CellPluginBuild';

export interface StyleMeta {
  /**
   * 字体颜色
   */
  color: string;

  /**
   * 背景颜色
   */
  backgroundColor?: string;

  /**
   * 水平位置
   */
  textAlign?: string;

  /**
   * 垂直位置
   */
  verticalAlign?: string;

  /**
   * 字体大小
   */
  fontSize?: number;

  /**
   * 字体粗细
   */
  fontWeight?: number;

  /**
   * 字体样式,斜体
   */
  fontStyle?: string;

  /**
   * 字体
   */
  fontFamily?: string;

  /**
   * 文本装饰样式
   */
  textDecorationStyle?: string;

  /**
   * 下划线
   */
  underline?: string;

  /**
   * 上划线
   */
  overline?: string;

  /**
   * 穿越线
   */
  lineThrough?: string;

  /**
   * 文本装饰线颜色
   */
  textDecorationColor?: string;
}

type StyleMetaKey = keyof StyleMeta;

export interface StyleBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

export class StyleBuild extends CellPluginBuild<StyleMeta> {

  private excelBuild: ExcelBuild;

  private index: number;

  // cssRule索引
  private styleIndex: number;

  // 单元格文本样式索引
  private cellTextStyleIndex: number;
  // 样式类名
  private className: string;

  public constructor(args: StyleBuildArgs) {
    super(args);
  }

  /**
   * 初始化数据层
   * @override
   */
  protected initData(args: StyleBuildArgs) {
    super.initData(args);
    this.excelBuild = args.excelBuild;
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
  }

  /**
   * 获取所在列表的索引
   */
  public getIndex() {
    if (this.index != null) {
      return this.index;
    }
    this.index = this.excelBuild.getStyleBuilds().indexOf(this);
    return this.index;
  }

  /**
   * 刷新索引编号
   * @returns 
   */
  public refreshIndex() {
    if (this.index == null) {
      return;
    }
    this.index = this.excelBuild.getStyleBuilds().indexOf(this);
    return this.index;
  }

  /**
   * 转换成样式表
   */
  public toStyle() {
    // 转换为内联样式或者样式类
    return this.metaInfo || {};
  }

  /**
   * 设置属性值
   * @param key 
   * @param value 
   */
  public setProperty(key: StyleMetaKey, value: any, isCheck: boolean = true) {
    const undoManage = this.excelBuild.getUndoManage();
    const oldValue = this.metaInfo[key];
    if (oldValue == value) {
      return;
    }
    undoManage.beginUpdate();
    try {
      undoManage.storeUndoItem({
        c: this,
        p: key,
        op: Operate.Modify,
        v: value,
        ov: oldValue
      });
      super.setProperty(key, value);
      this.refreshClassName();
    } finally {
      undoManage.endUpdate();
    }
  }

  /**
   * 获取样式类名
   */
  public getClassName() {
    if (this.className) {
      return this.className;
    }
    const { underline, overline, lineThrough, textDecorationStyle, textDecorationColor, fontSize, ...style } = this.toStyle() as CSSStyleDeclaration;

    const className = this.className = uniqueId(AppConst.classNamePrefix);
    (style as any).fontSize = `${fontSize}px`;
    const cellTextStyle = {
      textDecorationLine: `${underline || ''} ${overline || ''} ${lineThrough || ''}`,
      textDecorationStyle,
      textDecorationColor,
    }
    this.styleIndex = addCssRule(className, style);
    this.cellTextStyleIndex = addCssRule(className + '>.cell_text_container>.cell_text', cellTextStyle);
    return className;
  }

  /**
   * 样式表是否只有这一个单一样式且值相等
   * @param property 
   * @param value 
   * @returns 
   */
  public isOnlyStyleValue(property: StyleMetaKey, value: any) {
    const keys = Object.keys(this.metaInfo);
    if (keys.length == 1 && keys.indexOf(property) > -1 && this.metaInfo[property] === value) {
      return true;
    }
    return false;
  }

  /**
   * 样式表是否只有这一个样式
   * @param property 
   */
  public isOnlyStyle(property: StyleMetaKey) {
    const keys = Object.keys(this.metaInfo);
    if (keys.length == 1 && keys.indexOf(property) > -1) {
      return true;
    }
    return false;
  }

  /**
   * 刷新最新样式类
   * 当样式只关联一个单元格或者选中的单元格是此样式的所有单元格才可以刷新,否则需要复制一个新的样式层来赋给新的单元格
   */
  public refreshClassName() {
    if (this.className == null) {
      this.className = uniqueId(AppConst.classNamePrefix);
    }
    // 如果样式索引不为空,删除样式表中的规则
    if (this.cellTextStyleIndex != null) {
      deleteCssRule(this.cellTextStyleIndex);
    }
    if (this.styleIndex != null) {
      deleteCssRule(this.styleIndex);
    }
    const { underline, overline, lineThrough, textDecorationStyle, textDecorationColor, fontSize, ...style } = this.toStyle() as CSSStyleDeclaration;
    (style as any).fontSize = `${fontSize}px`;
    const cellTextStyle = {
      textDecorationLine: `${underline || ''} ${overline || ''} ${lineThrough || ''}`,
      textDecorationStyle,
      textDecorationColor,
    }
    addCssRule(this.className, style, this.styleIndex);
    addCssRule(this.className + '>.cell_text_container>.cell_text', cellTextStyle, this.cellTextStyleIndex);
  }

  /**
   * 复制一个一模一样的样式数据层
   * @returns 
   */
  public copy() {
    return new StyleBuild({
      excelBuild: this.excelBuild,
      metaInfo: JSON.parse(JSON.stringify(this.metaInfo))
    });
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
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key as any, value);
        }
        break;
    }
  };
}