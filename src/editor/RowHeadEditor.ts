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
    this.tds = []
  }

  public initDom() {
    const build = this.build;
    const cells = build.getCells();
    cells.forEach((item, index) => {
      const colName = getColNameByOrder(index);
      const td = document.createElement('td');
      td.textContent = colName;
      this.tds.push(td);
      this.mainDom.appendChild(td);
    });
  }

  public render() {

  }
}