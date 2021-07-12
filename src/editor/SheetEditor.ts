import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import RowEditor from './RowEditor';
import ColHeadEditor from './ColHeadEditor';
import './SheetEditor.css';
import { UndoItem } from '../flow/UndoManage';
export interface SheetEditorArgs extends BaseEditorArgs {

}

export default class SheetEditor extends BaseEditor {

  protected build: SheetBuild;

  protected table: HTMLTableElement;

  protected rows: RowEditor[];

  protected rowHeadEditor: ColHeadEditor;

  protected selectDom: HTMLElement;

  protected focusCellDom: HTMLElement;

  public constructor(args: SheetEditorArgs) {
    super(args);
  }

  protected initData(args: SheetEditorArgs) {
    super.initData(args);
    this.rows = [];
  }

  protected initSelector() {
    const theme = this.build.getTheme();
    const selectDom = this.selectDom = document.createElement('div');
    selectDom.classList.add('selector');
    selectDom.classList.add(theme.getSelectThemeClass());
    const focusCellDom = this.focusCellDom = document.createElement('div');
    focusCellDom.classList.add('selector_focus_cell');
    const dotDom = document.createElement('div');
    dotDom.classList.add('selector_dot');
    dotDom.classList.add(theme.getSelectDotClass());
    selectDom.appendChild(dotDom)
    selectDom.appendChild(focusCellDom);
    this.mainDom.appendChild(selectDom);
  }

  protected initDom() {
    const build = this.build;
    const rows = build.getRows();
    const cols = build.getCols();
    const table = this.table = document.createElement('table');
    const width = build.getTableWidth();
    table.style.width = `${width}px`;
    // 初始化行头
    this.rowHeadEditor = new ColHeadEditor({
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
    this.initSelector();
  }

  /** @override */
  protected requestRenderChildrenUndoItem(undoItme: UndoItem) {
    this.rows.forEach(item => item.requestRenderUndoItem(undoItme));
    this.rowHeadEditor.requestRenderUndoItem(undoItme);
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      
    });
  }

  /**
   * 全量渲染
   */
  protected render() {
    this.rows.forEach(item => item.requestRender());
    this.rowHeadEditor.requestRender();
  }
}