/**
 * excel所有行为接口,ExcelBuild必须实现它
 */
export interface IExcelBehavior {
  addRow: (count: number) => void;

  /** 合并单元格 */
  merge: () => void;
}

export interface AbsToolbarArgs {
  excelBehavior: IExcelBehavior;
}

/**
 * 工具栏抽象类
 */
export abstract class AbsToolbar {

  private excelBehavior: IExcelBehavior;

  public constructor(args: AbsToolbarArgs) {
    this.excelBehavior = args.excelBehavior;
  }
}

export class DefaultToolBar extends AbsToolbar {

}