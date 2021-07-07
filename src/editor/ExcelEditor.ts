import BaseEditor from './BaseEditor';
import { IWorkBench } from '../flow/UndoManage';
import { ExcelBuild } from '../build/ExcelBuild';
import SheetEditor from './SheetEditor';

export interface ExcelEditorArgs {
  workbench: IWorkBench;

  build: ExcelBuild;
}

export default class ExcelEditor extends BaseEditor {

  private workbench: IWorkBench;

  protected build: ExcelBuild;

  protected sheetEditors: SheetEditor[];

  public constructor(args: ExcelEditorArgs) {
    super(args);
  }

  protected initData(args: ExcelEditorArgs) {
    super.initData(args);
    this.workbench = args.workbench;
    this.sheetEditors = [];
  }

  protected initDom() {
    const { build } = this;
    const sheets = build.getSheets();
    sheets.forEach(item => {
      this.sheetEditors.push(new SheetEditor({
        build: item,
        domParent: this.mainDom
      }));
    });
  }

  protected render() {
    this.sheetEditors.forEach(item => item.requestRender());
  }
}