import { BaseEditorArgs } from './BaseEditor';
import BaseEditor from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import { getColNameByOrder } from '../utils/common';
export interface RowHeadEditorArgs extends BaseEditorArgs {

}

export default class RowHeadEditor extends BaseEditor {

  private tds: HTMLElement[];

  protected build: RowBuild;

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
    const cells = build.getCells();
    // 预留列头的位置
    const tdHead = document.createElement('td');
    this.mainDom.appendChild(tdHead);
    // 初始化行头
    cells.forEach((item, index) => {
      const colName = getColNameByOrder(index + 1);
      const td = document.createElement('td');
      td.textContent = colName;
      this.tds.push(td);
      this.mainDom.appendChild(td);
    });
  }

  public render() {

  }
}