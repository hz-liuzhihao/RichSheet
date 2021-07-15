import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import CellEditor from './CellEditor';
import { ColBuild } from '../build/ColBuild';
import RowHeadEditor from './RowHeadEditor';
import { UndoItem, Operate } from '../flow/UndoManage';
import { upperFirst } from 'lodash';
import { CellBuild } from '../build/CellBuild';

const styleProperty = [''];

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
   * 获取单元格
   * @returns 
   */
  public getCells() {
    return this.cells;
  }

  /**
   * 获取指定列的单元格
   * @param col 
   * @returns 
   */
  public getCell(col: number) {
    return this.cells[col];
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

  /** @override */
  protected requestRenderChildrenUndoItem(undoItem: UndoItem) {
    this.cells.forEach(item => item.requestRenderUndoItem(undoItem));
    this.colHeadEditor.requestRenderUndoItem(undoItem);
  }

  private renderStyle() {

  }

  /**
   * 渲染合并单元格
   */
  protected renderMerge(item: UndoItem) {
    const v = item.v as CellBuild;
    const ov = item.ov as CellBuild;
    
  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p, op } = item;
      if (op == Operate.Modify) {
        if (styleProperty.indexOf(p) > -1) {
          this.renderStyle();
        } else {
          const method = `render${upperFirst(p)}`;
          if (typeof this[method] == 'function') {
            return this[method](item);
          }
        }
      }
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