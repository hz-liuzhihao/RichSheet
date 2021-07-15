import { UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import CellPluginBuild from './CellPluginBuild';
import { uniqueId } from 'lodash';
import { AppConst } from '../config/constant';
import { addCssRule, deleteCssRule } from '../utils/style';

export interface BorderStyleMeta {
  style: BorderStyle;
  color: string;
  width: number;
}

type BorderStyleMetaKey = keyof BorderStyleMeta;

export interface BorderStyleBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

export class BorderStyleBuild extends CellPluginBuild<BorderStyleMeta> {

  private excelBuild: ExcelBuild;

  private styleIndex: number;

  private className: string;

  public constructor(args: BorderStyleBuildArgs) {
    super(args);
  }

  /** @override */
  protected initData(args: BorderStyleBuildArgs) {
    this.excelBuild = args.excelBuild;
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {

  }

  /**
   * 转换样式表
   * @returns 
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
    const className = this.className = uniqueId(AppConst.classNamePrefix + 'border_');
    this.styleIndex = addCssRule(className, style as CSSStyleDeclaration);
    return className;
  }

  /**
   * 刷新最新样式类
   * 当样式只关联一个单元格或者选中的单元格是此样式的所有单元格才可以刷新,否则需要复制一个新的样式层来赋给新的单元格
   */
  public refreshClassName() {
    if (this.className == null) {
      this.className = uniqueId(AppConst.classNamePrefix + 'border_');
    }
    // 如果样式索引不为空,删除样式表中的规则
    if (this.styleIndex != null) {
      deleteCssRule(this.styleIndex);
    }
    const style = this.toStyle();
    this.styleIndex = addCssRule(this.className, style as CSSStyleDeclaration);
  }

  /**
   * 复制一个边框数据层
   * @returns 
   */
  public copy() {
    return new BorderStyleBuild({
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