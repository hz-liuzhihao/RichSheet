import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import CellEditor from './CellEditor';

export interface RowEditorArgs extends BaseEditorArgs {
  build: RowBuild;
}

/**
 * 单元格编辑器
 */
export default class RowEditor extends BaseEditor {

  protected build: RowBuild;

  protected cells: CellEditor[];

  public constructor(args: RowEditorArgs) {
    args.type = 'tr';
    super(args);
    this.cells = [];
  }

  protected initDom() {
    const build = this.build;
    const cells = build.getCells();
    cells.forEach((cell, index) => {
      this.cells.push(new CellEditor({
        build: cell,
        domParent: this.mainDom
      }));
    });
  }

  /**
   * 渲染
   */
  protected render() {
    const build = this.build;
    const metaInfo = build.toJSON();
  }
}