/**
 * excel所有行为接口,ExcelBuild必须实现它
 */
export interface IExcelBehavior {
  /**
   * 添加行
   * 如果未选中行则添加到最后此时count参数有效
   * 如果有选中行则添加对应的行的行数此时count参数无效
   */
  addRow?: (count: number) => void;

  /**
   * 添加列
   * 如果未选中列则添加到最后此时count参数无效
   * 如果有选中列则添加对应的行数此时count参数无效
   */
  addCol?: (count: number) => void;

  /**
   * 删除行,此时必须有选中行
   */
  deleteRow?: () => void;

  /**
   * 删除列,此时必须有选中列
   */
  deleteCol?: () => void;

  /** 合并单元格 */
  mergeCell?: () => void;

  /**
   * 进行undo操作
   */
  undo?: () => void;

  /**
   * 进行redo操作
   */
  redo?: () => void;

  /**
   * 保存元数据
   */
  save?: () => void;

  /**
   * 是否可以undo
   */
  canUndo?: () => boolean;

  /**
   * 是否可以redo
   */
  canRedo?: () => boolean;

  /**
   * 是否可以保存
   */
  canSave?: () => boolean;
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