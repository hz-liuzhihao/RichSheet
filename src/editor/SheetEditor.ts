import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import RowEditor from './RowEditor';
import ColHeadEditor from './ColHeadEditor';
import './SheetEditor.css';
import { UndoItem } from '../flow/UndoManage';
import { capitalize } from 'lodash';
import { setDomStyle } from '../utils/style';
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
    // 聚焦单元格先不做
    // selectDom.appendChild(focusCellDom);
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
   * 获取指定行列的单元格编辑器
   * @param row 
   * @param col 
   */
  public getCellEditor(row: number, col: number) {
    const rowEditor = this.rows[row];
    return rowEditor.getCell(col);
  }

  /**
   * 渲染选中信息
   * @param undoItem 
   */
  protected renderSelect(undoItem: UndoItem) {
    const c = undoItem.c as SheetBuild;
    const selector = c.getSelector();
    const focuCell = selector.focusCell;
    const selectInfos = selector.selectors;
    const { selectDom } = this;
    if (selectInfos.length > 1) {
      // TODO 渲染有多个选区时
    } else {
      const selectInfo = selectInfos[0];
      const { rowStart, colStart, rowEnd, colEnd } = selectInfo;
      const startEditor = this.getCellEditor(rowStart, colStart);
      const endEditor = this.getCellEditor(rowEnd, colEnd);
      const startPosition = startEditor.getPosRelaTable();
      const endPosition = endEditor.getPosRelaTable();
      const { top, left, width, height } = startPosition;
      const { top: endTop, left: endLeft, width: endWidth, height: endHeight } = endPosition;
      let realTop;
      let maxTop;
      let realLeft;
      let maxLeft;
      let lastWidth;
      let lastHeight;
      if (top < endTop) {
        realTop = top;
        maxTop = endTop;
        lastHeight = endHeight;
      } else {
        realTop = endTop;
        maxTop = top;
        lastHeight = height;
      }
      if (left < endLeft) {
        realLeft = left;
        maxLeft = endLeft;
        lastWidth = endWidth;
      } else {
        realLeft = endLeft;
        maxLeft = left;
        lastWidth = width;
      }
      const right = maxLeft + lastWidth;
      const bottom = maxTop + lastHeight;
      // 由于选中边框原因全部缩小1
      setDomStyle(selectDom, {
        left: realLeft - 1.5,
        top: realTop - 1.5,
        width: right - realLeft - 1.5,
        height: bottom - realTop - 1.5,
      });
    }
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p } = item;
      const methond = `render${capitalize(p)}`;
      if (typeof this[methond] == 'function') {
        return this[methond](item);
      }
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