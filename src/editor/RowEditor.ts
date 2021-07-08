import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import CellEditor from './CellEditor';
import { ColBuild } from '../build/ColBuild';
import RowHeadEditor from './RowHeadEditor';

export interface RowEditorArgs extends BaseEditorArgs {
  build: RowBuild;

  colHeadBuild: ColBuild;
}

/**
 * 单元格编辑器
 */
export default class RowEditor extends BaseEditor {

  protected build: RowBuild;

  protected cells: CellEditor[];

  protected colHeadEditor: RowHeadEditor;

  public constructor(args: RowEditorArgs) {
    args.type = 'tr';
    super(args);
  }

  /**
   * @override
   * @param args 
   */
  protected initData(args: RowEditorArgs) {
    super.initData(args);
    this.cells = [];
  }

  /**
   * @override
   */
  protected initDom() {
    const build = this.build;
    const cells = build.getCells();

    // 初始化行头
    this.colHeadEditor = new RowHeadEditor({
      build,
      domParent: this.mainDom
    });

    // 初始化行其他单元格
    cells.forEach(cell => {
      this.cells.push(new CellEditor({
        build: cell,
        domParent: this.mainDom
      }));
    });
  }

  /**
   * 渲染
   * @override
   */
  protected render() {
    this.cells.forEach(item => item.requestRender());
    this.colHeadEditor.requestRender();
  }
}