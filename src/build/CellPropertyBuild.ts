import { BaseBuildArgs, UndoItem, Operate } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import CellPluginBuild from './CellPluginBuild';
export interface CellPropertyMeta {
  // 单元格输入类型,填报阶段需要
  inputType: string;
  // 输入前的placeholder
  placeholder: string;

  [key: string]: any;
}

type CellPropertyKey = keyof CellPropertyMeta;

export interface CellPropertyArgs extends BaseBuildArgs {
  execelBuild: ExcelBuild;
}

export class CellPropertyBuild extends CellPluginBuild<CellPropertyMeta> {

  private excelBuild: ExcelBuild;

  public constructor(args: CellPropertyArgs) {
    super(args);
  }

  /**
   * 初始化数据层
   * @param args 
   */
  protected initData(args: CellPropertyArgs) {
    this.excelBuild = args.execelBuild;
  }

  protected initMeta() {

  }

  public copy() {
    return new CellPropertyBuild({
      execelBuild: this.excelBuild,
      metaInfo: this.metaInfo
    });
  }

  /** @override */
  public restoreUndoItem(undoItem: UndoItem) {
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
  }
}