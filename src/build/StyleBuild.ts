import { UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import { uniqueId } from 'lodash';
import { addCssRule, deleteCssRule } from '../utils/style';
import { AppConst } from '../config/constant';
import CellPluginBuild from './CellPluginBuild';

export interface StyleMeta {
  value: string;
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
   * 获取样式类名
   */
  public getClassName() {
    if (this.className) {
      return this.className;
    }
    const style = this.toStyle();
    const className = this.className = uniqueId(AppConst.classNamePrefix);
    this.styleIndex = addCssRule(className, style as CSSStyleDeclaration);
    return className;
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
    if (this.styleIndex != null) {
      deleteCssRule(this.styleIndex);
    }
    const style = this.toStyle();
    this.styleIndex = addCssRule(this.className, style as CSSStyleDeclaration);
  }

  /**
   * 复制一个一模一样的样式数据层
   * @returns 
   */
  public copy() {
    return new StyleBuild({
      excelBuild: this.excelBuild,
      metaInfo: this.metaInfo
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