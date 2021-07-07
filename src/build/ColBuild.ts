import { BaseBuild, Operate, UndoItem } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { CellBuild } from './CellBuild';

export interface ColMeta {
  /**
   * 列头的宽度
   */
  width: number;
  /**
   * 列头的高度
   */
  height: number;
  /**
   * 列头文本
   */
  title: string;
  /**
   * 序号
   */
  index: number;
}

type ColHeadMetaKey = keyof ColMeta;

export class ColBuild extends BaseBuild<ColMeta> {

  private cells: CellBuild[];

  private sheet: SheetBuild;

  restoreUndoItem(undoItem: UndoItem<ColMeta>) {
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
  }
}