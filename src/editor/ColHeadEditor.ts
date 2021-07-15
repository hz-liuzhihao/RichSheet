import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { SheetBuild } from '../build/SheetBuild';
import { upperFirst } from 'lodash';
import './RowHeadEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { ColBuild } from '../build/ColBuild';
export interface ColHeadEditorArgs extends BaseEditorArgs {

}

export default class ColHeadEditor extends BaseEditor {

  private tds: HTMLElement[];

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
    const tdHead = document.createElement('td');
    const cornerClass = build.getCornerClass();
    cornerClass && tdHead.classList.add(cornerClass);
    this.mainDom.appendChild(tdHead);
    // 初始化行头
    cols.forEach((item, index) => {
      const colName = item.getProperty('index');
      const td = document.createElement('td');
      const textDom = document.createElement('span');
      td.appendChild(textDom);
      const dragDom = document.createElement('div');
      dragDom.classList.add('col_head_drag');
      td.appendChild(dragDom);
      const colHeadClassName = item.getThemeClassName();
      colHeadClassName && td.classList.add(colHeadClassName);
      td.classList.add('colhead_item');
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
    const index = build.getColNumber();
    const colDom = this.tds[index];
    if (isPreview) {
      colDom.style.width = `${v}px`;
    } else {
      const width = build.getWidth();
      colDom.style.width = `${width}px`;
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
      const { p, op } = item;
      if (op == Operate.Modify) {
        const method = `render${upperFirst(p)}`;
        if (typeof this[method] == 'function') {
          return this[method](item);
        }
      }
    });
  }

  protected render() {

  }
}