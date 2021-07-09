import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';
import CellPluginBuild from './CellPluginBuild';

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

/**
 * 边框数据层,一个边框可能被几个单元格所共享
 */
export class BorderBuild extends CellPluginBuild<BoderMeta> {

  public constructor(args: BorderBuildArgs) {
    super(args);
  }

  protected initData(args: BorderBuildArgs) {
    super.initData(args);
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
}