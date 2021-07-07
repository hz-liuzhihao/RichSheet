import { BaseBuild, Operate, UndoItem, BaseBuildArgs } from '../flow/UndoManage';
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

export interface RowBuildArgs extends BaseBuildArgs {
  sheet: SheetBuild;
}

export class RowBuild extends BaseBuild<RowMeta> {

  private sheet: SheetBuild;

  private cells: CellBuild[];

  public constructor(args: RowBuildArgs) {
    super(args);
    this.sheet = args.sheet;
  }

  /**
   * 初始化数据
   * @param args 
   */
  protected initData(args: RowBuildArgs) {

  }

  /**
   * 转换元数据
   * @override
   */
   protected initMeta() {

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