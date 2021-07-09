import { Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import CellPluginBuild from './CellPluginBuild';

export interface ExpressionMeta {
  /**
   * 单元格值
   * 表达式 表达式为js环境,如=SUM(${cell1}:${cell2}) 编译时应该将${cell1}和${cell2}编译出结果
   * 非等号开头
   * 等号开头
   */
  value: string;
}

export interface ExpressionBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

type ExpressionMetaKey = keyof ExpressionMeta;

export class ExpressionBuild extends CellPluginBuild<ExpressionMeta> {

  private excelBuild: ExcelBuild;

  public constructor(args: ExpressionBuildArgs) {
    super(args);
  }

  /** @override */
  protected initData(args: ExpressionBuildArgs) {
    this.excelBuild = args.excelBuild
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {

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

  /**
   * 获取表达式解析后的文本
   */
  public getRenderText() {
    return '';
  }


}