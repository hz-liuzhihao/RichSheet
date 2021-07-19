import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import RowEditor from './RowEditor';
import ColHeadEditor from './ColHeadEditor';
import './SheetEditor.css';
import { UndoItem } from '../flow/UndoManage';
import { upperFirst } from 'lodash';
import { setDomStyle } from '../utils/style';
import { ColBuild } from '../build/ColBuild';
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
      domParent: table,
      workbench: this.workbench
    });
    // 初始化行
    rows.forEach((item, index) => {
      // 初始化列头
      const colHeadBuild = cols[index];
      this.rows.push(new RowEditor({
        build: item,
        domParent: table,
        colHeadBuild,
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
    const sheetBuild = this.build;
    const selector = sheetBuild.getSelector();
    const focuCell = selector.focusCell;
    const selectInfos = selector.selectors;
    const { selectDom } = this;
    if (selectInfos.length > 1) {
      // TODO 渲染有多个选区时
    } else {
      const selectInfo = selectInfos[0];
      const { rowStart, colStart, rowEnd, colEnd } = selectInfo;
      const width = sheetBuild.getSelectWidth(colStart, colEnd);
      const height = sheetBuild.getSelectHeight(rowStart, rowEnd);
      const left = sheetBuild.getSelectLeft(colStart);
      const top = sheetBuild.getSelectTop(rowStart);
      // 由于选中边框原因全部缩小1.5
      setDomStyle(selectDom, {
        left: left - 1.5,
        top: top - 1.5,
        width: width - 1.5,
        height: height - 1.5,
      });
    }
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p, c } = item;
      const methond = `render${upperFirst(p)}`;
      if (typeof this[methond] == 'function') {
        return this[methond](item);
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
    this.rowHeadEditor.requestRender();
  }
}