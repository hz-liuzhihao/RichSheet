import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';

export interface BoderMeta {
  style: BorderStyle;
  color: string;
  width: number;
  row: number;
  col: number;
}

type BoderMetaKey = keyof BoderMeta;

export interface BorderBuildArgs extends BaseBuildArgs {
  row: RowBuild;

  col: ColBuild;
}

export class BorderBuild extends BaseBuild<BoderMeta> {

  private rowBuild: RowBuild;

  private colBuild: ColBuild;

  public constructor(args: BorderBuildArgs) {
    super(args);
  }

  protected initData(args: BorderBuildArgs) {
    this.rowBuild = args.row;
    this.colBuild = args.col;
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