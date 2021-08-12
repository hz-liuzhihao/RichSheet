import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import { upperFirst } from 'lodash';
import './RowHeadEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { ColBuild } from '../build/ColBuild';
import { RowBuild } from '../build/RowBuild';
export interface ColHeadEditorArgs extends BaseEditorArgs {

}

export default class ColHeadEditor extends BaseEditor {

  private tds: HTMLElement[];

  private thHead: HTMLElement;

  protected build: SheetBuild;

  protected acceptDom: HTMLElement[];

  public constructor(args: ColHeadEditorArgs) {
    args.type = 'tr';
    super(args);
  }

  protected initData(args: ColHeadEditorArgs) {
    super.initData(args);
    this.mainClassName = 'colheadeditor';
    this.tds = [];
  }

  protected initDom() {
    const build = this.build;
    const cols = build.getCols();
    // 预留列头的位置
    const tdHead = this.thHead = document.createElement('td');
    const cornerClass = build.getCornerClass();
    cornerClass && tdHead.classList.add(cornerClass);
    this.mainDom.appendChild(tdHead);
    const isDesign = this.workbench.isDesign();
    // 初始化行头
    cols.forEach((item, index) => {
      const colName = item.getColName();
      const td = document.createElement('td');
      const textDom = document.createElement('span');
      td.appendChild(textDom);
      if (isDesign) {
        const dragDom = document.createElement('div');
        dragDom.classList.add('col_head_drag');
        td.appendChild(dragDom);
      }
      const colHeadClassName = item.getThemeClassName();
      colHeadClassName && td.classList.add(colHeadClassName);
      td.classList.add('colhead_item');
      // TODO 当列头数据层修改时需要同步
      td.__build__ = item;
      Object.assign(td.style, item.toStyle());
      textDom.textContent = colName;
      this.tds.push(td);
      this.mainDom.appendChild(td);
    });
  }

  protected renderWidth(item: UndoItem) {
    const { v, isPreview } = item;
    const build = item.c as ColBuild;
    const index = build.getIndex();
    const colDom = this.tds[index];
    if (isPreview) {
      colDom.style.width = `${v}px`;
    } else {
      const width = build.getWidth();
      colDom.style.width = `${width}px`;
    }
  }

  /**
   * 渲染单元格选中时选中单元格显示
   * @param item 
   */
  protected renderSelect(item: UndoItem) {
    const sheetBuild = this.build;
    const focusCell = sheetBuild.getSelector().focusCell;
    const rows = sheetBuild.getRows();
    const cols = sheetBuild.getCols();
    if (focusCell) {
      const rowBuild = rows[focusCell.getRow()] as RowBuild;
      const colBuild = cols[focusCell.getCol()] as ColBuild;
      this.thHead.onclick = function () {
        sheetBuild.clearSelect();
      }
      this.thHead.textContent = `${colBuild.getColName()}${rowBuild.getRowName()}`
    }
  }

  /** @override */
  protected renderBuild(undoItem: UndoItem) {
    const { c } = undoItem;
    if (c == this.build) {
      this.needRenderUndoItems.push(undoItem);
    }
    if (c instanceof ColBuild) {
      this.needRenderUndoItems.push(undoItem);
    }
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p } = item;
      const method = `render${upperFirst(p)}`;
      if (typeof this[method] == 'function') {
        return this[method](item);
      }
    });
  }

  /**
   * 渲染列名
   * @param start 
   */
  renderColName(start) {
    for (let i = start + 1; i < this.tds.length; i++) {
      const tdDom = this.tds[i];
      const build = tdDom.__build__ as ColBuild;
      const textDom = tdDom.getElementsByTagName('span')[0];
      textDom.textContent = build.getColName();
    }
  }

  /**
   * 移除指定列
   * @param start 
   * @param count 
   */
  public removeCol(start: number, count: number) {
    const deleteCols = this.tds.splice(start + 1, count);
    deleteCols.forEach(e => {
      e.remove();
      this.acceptDom.push(e);
    });
    this.renderColName(start);
  }

  /**
   * 添加列
   * @param start 
   * @param count 
   */
  public addCol(start: number, count: number) {
    const cols = this.build.getCols();
    const addCols = cols.slice(start + 1, start + count + 1);
    const beforeDom = this.tds[start + 1];
    const isDesign = this.workbench.isDesign();
    addCols.forEach((item, index) => {
      const colName = item.getColName();
      let td;
      if (this.acceptDom.length) {
        td = this.acceptDom.shift();
        const textDom = td.getElementsByTagName('span')[0];
        textDom.textContent = colName;
      } else {
        td = document.createElement('td');
        const textDom = document.createElement('span');
        td.appendChild(textDom);
        if (isDesign) {
          const dragDom = document.createElement('div');
          dragDom.classList.add('col_head_drag');
          td.appendChild(dragDom);
        }
        const colHeadClassName = item.getThemeClassName();
        colHeadClassName && td.classList.add(colHeadClassName);
        td.classList.add('colhead_item');
        // TODO 当列头数据层修改时需要同步
        td.__build__ = item;
        Object.assign(td.style, item.toStyle());
        textDom.textContent = colName;
      }
      this.tds.splice(start + 1 + index, 0, td);
      this.mainDom.insertBefore(td, beforeDom);
    });
    this.renderColName(start + count);
  }

  public render() {

  }
}