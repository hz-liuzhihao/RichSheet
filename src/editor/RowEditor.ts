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
}

/**
 * 单元格编辑器
 */
export default class RowEditor extends BaseEditor {

  protected build: RowBuild;

  protected cells: CellEditor[];

  protected rowHeadEditor: RowHeadEditor;

  protected acceptDom: CellEditor[];

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
    this.mainClassName = 'roweditor';
    this.cells = [];
  }

  /**
   * @override
   */
  protected initDom() {
    const build = this.build;
    const cells = build.getCells();

    // 初始化行头
    this.rowHeadEditor = new RowHeadEditor({
      build,
      domParent: this.mainDom,
      workbench: this.workbench
    });

    // 初始化行其他单元格
    cells.forEach((cell, index) => {
      // 只有单元格的行列刚好在这个位置采取渲染单元格
      if (cell.getRow() == build.getIndex() && cell.getCol() == index) {
        this.cells.push(new CellEditor({
          build: cell,
          domParent: this.mainDom,
          workbench: this.workbench
        }));
      } else {
        this.cells.push(null);
      }
    });
  }

  /** @override */
  protected requestRenderChildrenUndoItem(undoItem: UndoItem) {
    this.cells.forEach(item => item && item.requestRenderUndoItem(undoItem));
    this.rowHeadEditor.requestRenderUndoItem(undoItem);
  }

  private renderStyle() {

  }

  /**
   * 移除cellEditor
   * @param i 
   */
  private removeCellEditor(i: number) {
    this.cells[i].destroy();
    this.acceptDom.push(this.cells[i]);
    this.cells[i] = null;
  }

  /**
   * 移除列
   * @param start 
   * @param count 
   */
  public removeCol(start: number, count: number) {
    const deleteCols = this.cells.splice(start + 1, count);
    deleteCols.forEach(editor => {
      editor.destroy();
      this.acceptDom.push(editor);
    });
  }

  /**
   * 添加cellEditor 是替换模式
   * @param i 
   * @param cellBuild 
   */
  public addCellEditor(i: number, cellBuild: CellBuild) {
    let beforeEditor: CellEditor = null;
    for (let index = i + 1; index < this.cells.length; index++) {
      if (this.cells[index] != null) {
        beforeEditor = this.cells[index];
        break;
      }
    }
    if (this.acceptDom.length > 0) {
      const cellEditor = this.acceptDom.shift();
      cellEditor.setBuild(cellBuild);
      cellEditor.render();
      const mainDom = cellEditor.getMainDom();
      if (beforeEditor) {
        this.mainDom.insertBefore(mainDom, beforeEditor.getMainDom());
      } else {
        this.mainDom.appendChild(mainDom);
      }
      cellEditor.setParent(this.mainDom);
      this.cells[i] = cellEditor;
    } else {
      const cellEditor = new CellEditor({
        build: cellBuild,
        workbench: this.workbench
      });
      cellEditor.render();
      const mainDom = cellEditor.getMainDom();
      if (beforeEditor) {
        this.mainDom.insertBefore(mainDom, beforeEditor.getMainDom());
      } else {
        this.mainDom.appendChild(mainDom);
      }
      this.cells[i] = cellEditor;
    }
  }

  /**
   * 插入模式
   * @param i 插入到某个cell的前面
   * @param cellBuild 
   */
  public insertCellEditor(i: number, cellBuild: CellBuild) {
    let beforeEditor: CellEditor = null;
    for (let index = i; index < this.cells.length; index++) {
      if (this.cells[index] != null) {
        beforeEditor = this.cells[index];
        break;
      }
    }
    if (this.acceptDom.length > 0) {
      const cellEditor = this.acceptDom.shift();
      cellEditor.setBuild(cellBuild);
      cellEditor.requestRender();
      const mainDom = cellEditor.getMainDom();
      if (beforeEditor) {
        this.mainDom.insertBefore(mainDom, beforeEditor.getMainDom());
      } else {
        this.mainDom.appendChild(mainDom);
      }
      cellEditor.setParent(this.mainDom);
      this.cells.splice(i, 0, cellEditor);
    } else {
      const cellEditor = new CellEditor({
        build: cellBuild,
        workbench: this.workbench
      });
      cellEditor.requestRender();
      const mainDom = cellEditor.getMainDom();
      if (beforeEditor) {
        this.mainDom.insertBefore(mainDom, beforeEditor.getMainDom());
      } else {
        this.mainDom.appendChild(mainDom);
      }
      this.cells.splice(i, 0, cellEditor);
    }
  }

  /**
   * 渲染合并单元格
   */
  protected renderMerge(item: UndoItem) {
    const col = item.i;
    const row = this.build.getIndex();
    const cellBuild = this.build.getCell(col);
    const cellRow = cellBuild.getRow();
    const cellCol = cellBuild.getCol();
    const cellEditor = this.cells[col];
    if (cellEditor == null) {
      if (cellRow == row && cellCol == col) {
        this.addCellEditor(col, cellBuild);
      }
    } else if (cellEditor.getBuild() !== cellBuild) {
      if (cellRow != row || cellCol != col) {
        this.removeCellEditor(col);
      }
    }
  }

  /**
   * 设置数据层
   * @param build 
   */
  public setBuild(build: RowBuild) {
    const cells = build.getCells();
    const row = this.build.getIndex();
    cells.forEach((cell, index) => {
      const cellRow = cell.getRow();
      const cellCol = cell.getCol();
      const cellEditor = this.cells[index];
      if (cellEditor == null) {
        if (cellRow == row && cellCol == index) {
          this.addCellEditor(index, cell);
        }
      }
    });
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
   * 渲染行头
   */
  public renderRowHead() {
    this.rowHeadEditor.requestRender();
  }

  /**
   * 渲染
   * @override
   */
  public render() {
    this.cells.forEach(item => item && item.requestRender());
    this.rowHeadEditor.requestRender();
  }
}