import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { CellBuild } from '../build/CellBuild';
import './CellEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { upperFirst } from 'lodash';

const styleProperty = [''];

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
   * 获取相对于table的位置
   */
  public getPosRelaTable(): PositionInfo {
    const mainDom = this.mainDom;
    return {
      left: mainDom.offsetLeft,
      top: mainDom.offsetTop,
      width: mainDom.offsetWidth,
      height: mainDom.offsetHeight
    };
  }

  /**
   * 获取相对于视口的位置
   */
  public getPosRelaView() {
    const mainDom = this.mainDom;
    const rect = mainDom.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    };
  }

  private renderStyle() {

  }

  protected renderRowSpan(item: UndoItem) {
    const build = this.build;
    const rowSpan = build.getRowSpan();
    const mainDom = this.mainDom as HTMLTableCellElement;
    mainDom.rowSpan = rowSpan;
  }

  protected renderColSpan(item: UndoItem) {
    const build = this.build;
    const colSpan = build.getColSpan();
    const mainDom = this.mainDom as HTMLTableCellElement;
    mainDom.colSpan = colSpan;
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
   */
  protected render() {
    const build = this.build;
    const mainDom = this.mainDom;
    const themeClassName = build.getThemeClassName();
    const styleClassName = build.getClassName();
    const borderClassName = build.getBorderClassName();
    themeClassName && mainDom.classList.add(themeClassName);
    styleClassName && mainDom.classList.add(styleClassName);
    borderClassName && mainDom.classList.add(borderClassName);
  }
}