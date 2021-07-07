import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';
import { ExcelBuild } from './ExcelBuild';

export interface StyleMeta {

}

interface BoderMeta {
  style: BorderStyle;
  color: string;
  width: number;
}

type BoderMetaKey = keyof BoderMeta;

export interface StyleBuildArgs extends BaseBuildArgs {
  excelBuild: ExcelBuild;
}

export class StyleBuild extends BaseBuild<BoderMeta> {

  private excelBuild: ExcelBuild;

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

  restoreUndoItem(undoItem: UndoItem<BoderMeta>) {
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