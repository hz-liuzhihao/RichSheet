import { BaseBuild, Operate, UndoItem, IWorkBench } from '../flow/UndoManage';
import { SheetBuild } from './SheetBuild';
import { StyleBuild } from './StyleBuild';
import { ExcelBehavior } from '../controllers/ToolBar';

/**
 * excel元数据
 */
interface ExcelMeta {
  // 默认行高度
  defaultRowHeight: number;
  // 默认列宽度
  defaultColWidth: number;
}

type ExcelMetaKey = keyof ExcelMeta;

export interface ExcelBuildArgs {
  workbench: IWorkBench;
}

export class ExcelBuild extends BaseBuild<ExcelMeta> implements ExcelBehavior {

  private currentIndex: number;

  private sheets: SheetBuild[];

  private workbench: IWorkBench;

  private styleBuilds: StyleBuild[];

  public constructor(args: ExcelBuildArgs) {
    super();
    this.workbench = args.workbench;
  }

  /** @implements */
  restoreUndoItem(undoItem: UndoItem<ExcelMeta>) {
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

  /**
   * 添加行
   * @param count
   */
  public addRow(count: number) {
    // TOOD
  }
}