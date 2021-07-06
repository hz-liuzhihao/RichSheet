import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { CellBuild } from '../build/CellBuild';

export interface CellEditorArgs extends BaseEditorArgs {
  build: CellBuild;
}

/**
 * 单元格编辑器
 */
export default class CellEditor extends BaseEditor {

  protected build: CellBuild;

  public constructor(args: CellEditorArgs) {
    args.type = 'td';
    super(args);
  }

  protected initDom() {

  }

  /**
   * 渲染
   */
  protected render() {
    const build = this.build;
    const metaInfo = build.toJSON();
  }
}