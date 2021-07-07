import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';

export interface BoderStyleMeta {
  style: BorderStyle;
  color: string;
  width: number;
}

type BoderStyleMetaKey = keyof BoderStyleMeta;

export interface BorderStyleBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

export class BorderStyleBuild extends BaseBuild<BoderStyleMeta> {

  private excelBuild: ExcelBuild;

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

  restoreUndoItem(undoItem: UndoItem<BoderStyleMeta>) {
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
          this.setProperty(key, value);
        }
        break;
    }
  };
}