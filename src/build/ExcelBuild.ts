import { BaseBuild, Operate, UndoItem, IWorkBench, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild, SheetMeta } from './SheetBuild';
import { StyleBuild } from './StyleBuild';
import { ExcelBehavior } from '../controllers/ToolBar';

/**
 * excel元数据
 */
export interface ExcelMeta {
  // 默认行高度
  defaultRowHeight: number;
  // 默认列宽度
  defaultColWidth: number;
  defaultRows: number;
  defaultCols: number;

  sheets: SheetMeta[];
}

type ExcelMetaKey = keyof ExcelMeta;

export interface ExcelBuildArgs extends BaseBuildArgs {
  workbench: IWorkBench;
}

/**
 * sheet的全局数据层
 * 包含sheet的一些共用数据,如样式,
 */
export class ExcelBuild extends BaseBuild<ExcelMeta> implements ExcelBehavior {

  private currentIndex: number;

  private sheets: SheetBuild[];

  private workbench: IWorkBench;

  private styleBuilds: StyleBuild[];

  /**
   * 初始化原始数据
   * @param args 
   */
  protected initData(args: ExcelBuildArgs) {
    this.workbench = args.workbench;
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
    const metaInfo = this.metaInfo;
    const sheets = metaInfo.sheets || [];
    sheets.forEach(sheet => {
      this.sheets.push(new SheetBuild({
        metaInfo: sheet,
        excelBuild: this
      }));
    });
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

  /**
   * 获取所有的sheet
   * @returns 
   */
  public getSheets() {
    return this.sheets;
  }

  /**
   * 获取当前编辑sheet
   * @returns 
   */
  public getCurrentSheet() {
    return this.sheets[this.currentIndex];
  }
}