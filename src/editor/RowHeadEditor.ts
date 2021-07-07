import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { getColNameByOrder } from '../utils/common';
import { SheetBuild } from '../build/SheetBuild';
import './RowHeadEditor.css';
export interface RowHeadEditorArgs extends BaseEditorArgs {

}

export default class RowHeadEditor extends BaseEditor {

  private tds: HTMLElement[];

  protected build: SheetBuild;

  public constructor(args: RowHeadEditorArgs) {
    args.type = 'tr';
    super(args);
  }

  protected initData(args: RowHeadEditorArgs) {
    super.initData(args);
    this.tds = [];
  }

  protected initDom() {
    const build = this.build;
    const cols = build.getCols();
    // 预留列头的位置
    const tdHead = document.createElement('td');
    this.mainDom.appendChild(tdHead);
    // 初始化行头
    cols.forEach((item, index) => {
      const colName = item.getProperty('index');
      const td = document.createElement('td');
      Object.assign(td.style, item.toStyle());
      td.textContent = colName;
      this.tds.push(td);
      this.mainDom.appendChild(td);
    });
  }

  public render() {

  }
}