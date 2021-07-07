import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import CellEditor from './CellEditor';
import { ColBuild } from '../build/ColBuild';
import ColHeadEditor from './ColHeadEditor';

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

  protected colHeadBuild: ColBuild;

  protected colHeadEditor: ColHeadEditor;

  public constructor(args: RowEditorArgs) {
    args.type = 'tr';
    super(args);
  }

  /**
   * @override
   * @param args 
   */
  protected initData(args: RowEditorArgs) {
    this.cells = [];
    this.colHeadBuild = args.colHeadBuild;
  }

  /**
   * @override
   */
  protected initDom() {
    const build = this.build;
    const cells = build.getCells();
    const colBuild = this.colHeadBuild;

    // 初始化行头
    this.colHeadEditor = new ColHeadEditor({
      build: colBuild,
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
    const build = this.build;
    const metaInfo = build.toJSON();
  }
}