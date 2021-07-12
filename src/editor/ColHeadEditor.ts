import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { getColNameByOrder } from '../utils/common';
import { SheetBuild } from '../build/SheetBuild';
import './RowHeadEditor.css';
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
      const colHeadClassName = item.getThemeClassName();
      colHeadClassName && td.classList.add(colHeadClassName);
      td.classList.add('colhead_item');
      td.__build__ = item;
      Object.assign(td.style, item.toStyle());
      td.textContent = colName;
      this.tds.push(td);
      this.mainDom.appendChild(td);
    });
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {

    });
  }

  protected render() {

  }
}