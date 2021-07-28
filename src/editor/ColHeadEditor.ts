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

  public constructor(args: ColHeadEditorArgs) {
    args.type = 'tr';
    super(args);
  }

  protected initData(args: ColHeadEditorArgs) {
    super.initData(args);
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

  protected render() {

  }
}