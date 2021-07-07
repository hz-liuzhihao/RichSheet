import { BaseBuild, UndoItem, Operate, BaseBuildArgs } from '../flow/UndoManage';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';
import { BorderBuild } from './BorderBuild';
import { StyleBuild } from './StyleBuild';

export interface CellMeta {
  /**
   * 单元格扩展属性
   */
  extend: JSONObject;

  row: number;

  col: number;

  index: number;

  styleIndex: number;

  expressionIndex: number;
}

export interface CellBuildArgs extends BaseBuildArgs {
  row: RowBuild;

  col: ColBuild;
}

type CellMetaKey = keyof CellMeta;

export class CellBuild extends BaseBuild<CellMeta> {

  private row: RowBuild;

  private col: ColBuild;

  private topBorderBuilds: BorderBuild[];

  private bottomBorderBuilds: BorderBuild[];

  private rightBorderBuilds: BorderBuild[];

  private leftBorderBuilds: BorderBuild[];

  private styleBuild: StyleBuild;

  private expressionBuild;

  public constructor(args: CellBuildArgs) {
    super(args);
  }

  protected initData(args: CellBuildArgs) {
    this.row = args.row;
    this.col = args.col;
  }

  /**
   * 转换元数据
   * @override
   */
   protected initMeta() {
     // 在行列中记录单元格
     const { row, col } = this.metaInfo;
     this.row[col] = this;
     this.col[row] = this;
  }

  restoreUndoItem(undoItem: UndoItem<CellMeta>) {
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