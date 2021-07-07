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
    this.rows = [];
  }

  protected initDom() {
    const build = this.build;
    const rows = build.getRows();
    const cols = build.getCols();
    this.table = document.createElement('table');
    // 初始化行头
    this.rowHeadEditor = new RowHeadEditor({
      build: rows[0],
      domParent: this.table
    });
    // 初始化行
    rows.forEach((item, index) => {
      // 初始化列头
      const colHeadBuild = cols[index];
      this.rows.push(new RowEditor({
        build: item,
        domParent: this.table,
        colHeadBuild
      }));
    });
  }

  protected render() {

  }
}