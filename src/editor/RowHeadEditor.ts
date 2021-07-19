import BaseEditor from './BaseEditor';
import { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import './ColHeadEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { upperFirst } from 'lodash';
export interface RowHeadEditorArgs extends BaseEditorArgs {

}

export default class RowHeadEditor extends BaseEditor {

  protected build: RowBuild;

  protected textDom: HTMLElement;

  public constructor(args: RowHeadEditorArgs) {
    args.type = 'td';
    super(args);
  }

  /** @override */
  protected initDom() {
    const textDom = this.textDom = document.createElement('span');
    this.mainDom.appendChild(textDom);
    if (this.workbench.isDesign()) {
      const dragDom = document.createElement('div');
      dragDom.classList.add('row_head_drag');
      this.mainDom.appendChild(dragDom);
    }
  }

  /**
   * 渲染行高
   * @param item 
   */
  protected renderHeight(item: UndoItem) {
    const { v, isPreview } = item;
    if (isPreview) {
      this.mainDom.style.height = `${v}px`;
    } else {
      const c = item.c as RowBuild;
      const height = c.getHeight();
      this.mainDom.style.height = `${height}px`;
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
    const { mainDom, build } = this;
    const index = build.getProperty('index');
    Object.assign(mainDom.style, build.toStyle());
    this.textDom.textContent = index;
    const rowHeadClass = build.getThemeClassName();
    rowHeadClass && mainDom.classList.add(rowHeadClass);
  }
}