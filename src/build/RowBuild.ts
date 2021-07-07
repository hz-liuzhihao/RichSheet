import { BaseBuild, Operate, UndoItem } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { CellBuild } from './CellBuild';

export interface RowMeta {
  /**
   * 行宽度
   */
  width: number;
  /**
   * 行高度
   */
  height: number;
  /**
   * 行头
   */
  title: string;
  /**
   * 序号
   */
  index: number;
}

type RowMetaKey = keyof RowMeta;

export interface RowHeadBuildArgs {
  sheet: SheetBuild;
}

export class RowBuild extends BaseBuild<RowMeta> {

  private sheet: SheetBuild;

  private cells: CellBuild[];

  public constructor(args: RowHeadBuildArgs) {
    super();
    this.sheet = args.sheet;
  }

  public getCells() {
    return this.cells;
  }

  restoreUndoItem(undoItem: UndoItem<RowMeta>) {
    const op = undoItem.op;
    const {sheet} = this;
    switch(op) {
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
  }
}