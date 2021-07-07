import { BaseBuild, UndoItem, Operate } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';

export interface StyleMeta {
  
}

interface BoderMeta {
  style: BorderStyle;
  color: string;
  width: number;
}

type BoderMetaKey = keyof BoderMeta;

export class StyleBuild extends BaseBuild<BoderMeta> {

  private builds: CellBuild[];

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