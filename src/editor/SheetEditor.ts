import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import RowEditor from './RowEditor';
import RowHeadEditor from './RowHeadEditor';
export interface SheetEditorArgs extends BaseEditorArgs {

}

export default class SheetEditor extends BaseEditor {

  protected build: SheetBuild;

  protected table: HTMLTableElement;

  protected rows: RowEditor[];

  protected rowHeadEditor: RowHeadEditor;

  public constructor(args: SheetEditorArgs) {
    super(args);
  }

  protected initData(args: SheetEditorArgs) {
    super.initData(args);
    this.rows = [];
  }

  protected initDom() {
    const build = this.build;
    const rows = build.getRows();
    const cols = build.getCols();
    const table = this.table = document.createElement('table');
    const width = build.getTableWidth();
    table.style.width = `${width}px`;
    // 初始化行头
    this.rowHeadEditor = new RowHeadEditor({
      build,
      domParent: table
    });
    // 初始化行
    rows.forEach((item, index) => {
      // 初始化列头
      const colHeadBuild = cols[index];
      this.rows.push(new RowEditor({
        build: item,
        domParent: table,
        colHeadBuild
      }));
    });
    this.mainDom.appendChild(table);
  }

  protected render() {
    this.rows.forEach(item => item.requestRender());
    this.rowHeadEditor.requestRender();
  }
}