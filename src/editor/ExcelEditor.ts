import BaseEditor from './BaseEditor';
import { IWorkBench, UndoItem } from '../flow/UndoManage';
import { ExcelBuild } from '../build/ExcelBuild';
import SheetEditor from './SheetEditor';

export interface ExcelEditorArgs {
  workbench: IWorkBench;

  build: ExcelBuild;
}

export default class ExcelEditor extends BaseEditor {

  protected build: ExcelBuild;

  protected sheetEditors: SheetEditor[];

  public constructor(args: ExcelEditorArgs) {
    super(args);
  }

  protected initData(args: ExcelEditorArgs) {
    super.initData(args);
    this.sheetEditors = [];
  }

  protected initDom() {
    const { build } = this;
    const sheets = build.getSheets();
    sheets.forEach(item => {
      this.sheetEditors.push(new SheetEditor({
        build: item,
        domParent: this.mainDom,
        workbench: this.workbench
      }));
    });
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {

    });
  }

  /** @override */
  protected requestRenderChildrenUndoItem(undoItem: UndoItem) {
    this.sheetEditors.forEach(item => {
      item.requestRenderUndoItem(undoItem);
    });
  }

  public render() {
    this.sheetEditors.forEach(item => item.requestRender());
  }
}