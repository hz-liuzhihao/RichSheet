/**
 * excel所有行为接口,ExcelBuild必须实现它
 */
export interface ExcelBehavior {
  addRow: (count: number) => void;
}

export interface AbsToolbarArgs {
  excelBehavior: ExcelBehavior;
}

/**
 * 工具栏抽象类
 */
export abstract class AbsToolbar {

  private excelBehavior: ExcelBehavior;

  public constructor(args: AbsToolbarArgs) {
    this.excelBehavior = args.excelBehavior;
  }
}

export class DefaultToolBar extends AbsToolbar {

}