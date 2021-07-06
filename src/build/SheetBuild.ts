import { BaseBuild, Operate, UndoItem } from '../flow/UndoManage';
import { ExcelBuild } from './ExcelBuild';
import { RowBuild } from './RowBuild';
import { ColBuild } from './ColBuild';

/**
 * 表格元数据
 */
interface SheetMeta {
  // 默认行高度
  defaultRowHeight: number;
  // 默认列宽度
  defaultColWidth: number;
}

type SheetMetaKey = keyof SheetMeta;

export interface SheetBuildArgs {
  excelBuild: ExcelBuild;
}

/**
 * 表格数据层
 */
export class SheetBuild extends BaseBuild<SheetMeta> {

  private excelBuild: ExcelBuild;

  private rowHeads: RowBuild[];

  private colHeads: ColBuild[];

  public constructor(args: SheetBuildArgs) {
    super();
    this.excelBuild = args.excelBuild;
  }

  /**
   * 获取行数据
   * @returns 
   */
  public getRows() {
    return this.rowHeads;
  }

  /**
   * 获取列数据
   * @returns 
   */
  public getCols() {
    return this.colHeads;
  }

  /** @implements */
  public restoreUndoItem(undoItem: UndoItem<SheetMeta>) {
    const op = undoItem.op;
    switch (op) {
      case Operate.Add:
        const c = undoItem.c;
        const i = undoItem.i;
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