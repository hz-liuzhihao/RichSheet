import { BaseBuild, UndoItem, Operate } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';

interface BoderStyleMeta {
  style: BorderStyle;
  color: string;
  width: number;
}

type BoderStyleMetaKey = keyof BoderStyleMeta;

export class BorderStyleBuild extends BaseBuild<BoderStyleMeta> {

  private cellBuilds: CellBuild[];

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