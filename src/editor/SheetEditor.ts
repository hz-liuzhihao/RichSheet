import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import RowEditor from './RowEditor';
import ColHeadEditor from './ColHeadEditor';
import './SheetEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { upperFirst } from 'lodash';
import { setDomStyle } from '../utils/style';
import { ColBuild } from '../build/ColBuild';
export interface SheetEditorArgs extends BaseEditorArgs {

}

export default class SheetEditor extends BaseEditor {

  protected build: SheetBuild;

  protected table: HTMLTableElement;

  protected rows: RowEditor[];

  protected colHeadEditor: ColHeadEditor;

  protected selectDom: HTMLElement;

  protected focusCellDom: HTMLElement;

  protected acceptDom: RowEditor[];

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
    // 初始化列头
    this.colHeadEditor = new ColHeadEditor({
      build,
      domParent: table,
      workbench: this.workbench
    });
    // 初始化行
    rows.forEach((item, index) => {
      this.rows.push(new RowEditor({
        build: item,
        domParent: table,
        workbench: this.workbench
      }));
    });
    this.mainDom.appendChild(table);
    this.initSelector();
  }

  /**
   * 渲染table宽度
   * @param undoItem 
   */
  protected renderTableWidth(undoItem: UndoItem) {
    const { v, isPreview } = undoItem;
    const tableWidth = this.build.getTableWidth();
    if (isPreview) {
      const build = undoItem.c as ColBuild;
      this.table.style.width = `${tableWidth + v - build.getWidth()}px`;
    } else {
      this.table.style.width = `${tableWidth}px`;
    }
  }

  /** @override */
  protected requestRenderChildrenUndoItem(undoItme: UndoItem) {
    this.rows.forEach(item => item.requestRenderUndoItem(undoItme));
    this.colHeadEditor.requestRenderUndoItem(undoItme);
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
    const sheetBuild = this.build;
    const selector = sheetBuild.getSelector();
    const focuCell = selector.focusCell;
    const selectInfos = selector.selectors;
    const { selectDom, focusCellDom } = this;
    if (selectInfos.length > 1) {
      // TODO 渲染有多个选区时
    } else {
      const selectInfo = selectInfos[0];
      const { rowStart, colStart, rowEnd, colEnd } = selectInfo;
      const focusRow = focuCell.getRow();
      const focusCol = focuCell.getCol();
      const focusRowSpan = focuCell.getRowSpan() || 1;
      const focusColSpan = focuCell.getColSpan() || 1;
      const width = sheetBuild.getSelectWidth(colStart, colEnd);
      const height = sheetBuild.getSelectHeight(rowStart, rowEnd);
      const left = sheetBuild.getSelectLeft(colStart);
      const top = sheetBuild.getSelectTop(rowStart);
      const focusWidth = sheetBuild.getSelectWidth(focusCol, focusCol + focusColSpan - 1);
      const focusHeight = sheetBuild.getSelectHeight(focusRow, focusRow + focusRowSpan - 1);
      const focusLeft = sheetBuild.getSelectLeft(focusCol);
      const focusTop = sheetBuild.getSelectTop(focusRow);
      let isSingleWidth = false;
      let isSingleHeight = false;
      if (colEnd - colStart == focusColSpan - 1) {
        isSingleWidth = true;
      }
      if (rowEnd - rowStart == focusRowSpan - 1) {
        isSingleHeight = true;
      }
      setDomStyle(focusCellDom, {
        left: focusLeft - left > 0 ? focusLeft - left : 1.5,
        top: focusTop - top > 0 ? focusTop - top : 1.5,
        width: isSingleWidth ? focusWidth - 6 : focusWidth - 3,
        height: isSingleHeight ? focusHeight - 6 : focusHeight - 3,
      });
      // 由于选中边框原因全部缩小1.5
      setDomStyle(selectDom, {
        left: left - 1.5,
        top: top - 1.5,
        width: width - 3,
        height: height - 3,
      });
    }
  }

  /**
   * 添加行渲染
   */
  protected renderAddRow(item: UndoItem) {
    const { start, count } = item.v;
    const rows = this.build.getRows();
    const tableDom = this.table;
    const rowMainDom = this.rows[start + 1].getMainDom();
    for (let i = start + 1; i <= count; i++) {
      let rowEditor: RowEditor;
      if (this.acceptDom.length) {
        rowEditor = this.acceptDom.shift();
        rowEditor.setBuild(rows[i]);
      } else {
        const rowBuild = rows[i];
        rowEditor = new RowEditor({
          build: rowBuild,
          workbench: this.workbench,
        });
      }
      const mainDom = rowEditor.getMainDom();
      this.rows.splice(i, 0, rowEditor);
      tableDom.insertBefore(mainDom, rowMainDom);
    }
  }

  /**
   * 渲染移除行
   * @param item 
   */
  protected renderRemoveRow(item: UndoItem) {
    const { start, count } = item.v;
    const deleteRowsEditor = this.rows.splice(start + 1, count);
    deleteRowsEditor.forEach(editor => {
      this.acceptDom.push(editor);
      editor.removeDom();
    });
  }

  /**
   * 渲染添加列
   * @param item 
   */
  protected renderAddCol(item: UndoItem) {
    const { start, count } = item.v;
    const rows = this.build.getRows();
    const colHeadEditor = this.colHeadEditor;
    for (let i = start + 1; i <= count; i++) {

    }
    const rowLength = this.rows.length;
    for (let i = 0; i < rowLength; i++) {
      const row = this.rows[i];
      for (let j = start + 1; j <= count; j++) {
        const cell = rows[i].getCells()[j];
        row.addCellEditor(j, cell);
      }
    }
  }

  /**
   * 渲染删除列
   * @param item 
   */
  protected renderRemoveCol(item: UndoItem) {
    const { start, count } = item.v;
    this.colHeadEditor.removeCol(start, count);
    // 每一行移除指定列
    this.rows.forEach(rowEditor => {
      rowEditor.removeCol(start, count);
    });
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p, c, op } = item;
      if (c == this.build) {
        let method;
        if (op == Operate.Add) {
          const opName = 'add';
          method = `render${upperFirst(opName)}${upperFirst(p)}`;
        } else if (op == Operate.Remove) {
          const opName = 'remove';
          method = `render${upperFirst(opName)}${upperFirst(p)}`;
        } else {
          method = `render${upperFirst(p)}`;
        }
        if (typeof this[method] == 'function') {
          return this[method](item);
        }
      }
      if (c instanceof ColBuild) {
        this.renderTableWidth(item);
      }
    });
  }

  protected renderBuild(undoItem: UndoItem) {
    const { c, p } = undoItem;
    if (c == this.build) {
      this.needRenderUndoItems.push(undoItem);
    }
    if (c instanceof ColBuild && p == 'width') {
      this.needRenderUndoItems.push(undoItem);
    }
  }

  /**
   * 全量渲染
   */
  protected render() {
    this.rows.forEach(item => item.requestRender());
    this.colHeadEditor.requestRender();
  }
}