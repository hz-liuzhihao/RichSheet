import { UndoManage, IWorkBench, UndoItem } from './flow/UndoManage';
import { ExcelBuild } from './build/ExcelBuild';
import ExcelEditor from './editor/ExcelEditor';

interface WorkbenchArgs {

}
class Workbench implements IWorkBench {

  private undoManage: UndoManage;

  private excelBuild: ExcelBuild;

  private excelEditor: ExcelEditor;

  public constructor(args: WorkbenchArgs) {
    this.initManage();
    this.initBuild();
    this.initEditor();
  }

  doChange: (undoItems: UndoItem<any>[]) => void;

  /**
   * 初始化数据管理器
   */
  private initManage() {
    this.undoManage = new UndoManage({
      workbench: this
    });
  }

  /**
   * 初始化数据层
   */
  private initBuild() {
    this.excelBuild = new ExcelBuild({
      workbench: this
    });
  }

  /**
   * 初始化编辑器
   */
  private initEditor() {
    this.excelEditor = new ExcelEditor({
      workbench: this,
      build: this.excelBuild
    });
  }
}

export interface RichSeetConfig {
  dom: string | HTMLElement;
}

export default class RichSheet {

  private workbench: Workbench;

  public constructor(config: RichSeetConfig) {
    this.workbench = new Workbench({

    });
  }
}