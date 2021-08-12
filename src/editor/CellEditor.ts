import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { CellBuild } from '../build/CellBuild';
import './CellEditor.css';
import { Operate, UndoItem } from '../flow/UndoManage';
import { upperFirst } from 'lodash';

export interface CellEditorArgs extends BaseEditorArgs {
  build: CellBuild;
}

/**
 * 单元格编辑器
 */
export default class CellEditor extends BaseEditor {

  protected build: CellBuild;

  protected textDom: HTMLElement;

  protected mainDom: HTMLTableCellElement;

  public constructor(args: CellEditorArgs) {
    args.type = 'td';
    super(args);
  }

  protected initData(args: CellEditorArgs) {
    super.initData(args);
    this.mainClassName = "celleditor";
  }

  protected initDom() {
    const textContainerDom = document.createElement('div');
    textContainerDom.classList.add('cell_text_container');
    const textDom = this.textDom = document.createElement('div');
    textDom.classList.add('cell_text');
    textContainerDom.appendChild(textDom);
    this.mainDom.appendChild(textContainerDom);
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

  /**
   * 渲染跨行单元格
   * @param item 
   */
  protected renderRowSpan(item: UndoItem) {
    const build = this.build;
    const rowSpan = build.getRowSpan();
    const mainDom = this.mainDom;
    mainDom.rowSpan = rowSpan;
  }

  /**
   * 渲染跨列单元格
   * @param item 
   */
  protected renderColSpan(item: UndoItem) {
    const build = this.build;
    const colSpan = build.getColSpan();
    const mainDom = this.mainDom;
    mainDom.colSpan = colSpan;
  }

  /**
   * 渲染文本
   * @param item 
   */
  protected renderText(item: UndoItem) {
    const textDom = this.textDom;
    textDom.textContent = this.build.getProperty('text');
  }

  /**
   * 渲染值
   * @param item 
   */
  protected renderValue(item: UndoItem) {
    const textDom = this.textDom;
    textDom.textContent = this.build.getProperty('value');
  }

  /**
   * 渲染单元格样式
   * @param item 
   */
  protected renderStyle(item: UndoItem) {
    const { v, ov } = item;
    let oldStyleBuild;
    if (item.isUndo) {
      oldStyleBuild = v;
    } else {
      oldStyleBuild = ov;
    }
    const styleBuild = this.build.getStyleBuild();
    const className = styleBuild && styleBuild.getClassName();
    const oldClassName = oldStyleBuild && oldStyleBuild.getClassName();
    oldClassName && this.mainDom.classList.remove(oldClassName);
    className && this.mainDom.classList.add(className);
  }

  /**
   * 渲染行修改
   * @param item 
   */
  protected renderRowBuild(item: UndoItem) {

  }

  /**
   * 修然列修改
   * @param item 
   */
  protected renderColBuild(item: UndoItem) {

  }

  /**
   * 渲染每个undo信息
   */
  protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {
      const { p, op } = item;
      if (op == Operate.Modify) {
        const method = `render${upperFirst(p)}`;
        if (typeof this[method] == 'function') {
          return this[method](item);
        }
      }
    });
  }

  public destroy() {
    const build = this.build;
    const mainDom = this.mainDom;
    const themeClassName = build.getThemeClassName();
    const styleClassName = build.getClassName();
    const borderClassName = build.getBorderClassName();
    themeClassName && mainDom.classList.remove(themeClassName);
    styleClassName && mainDom.classList.remove(styleClassName);
    borderClassName && mainDom.classList.remove(borderClassName);
    super.destroy();
  }

  /** @override */
  public render() {
    if (this.mainDom.parentElement == null) {
      this.parentDom && this.parentDom.appendChild(this.mainDom);
    }
    const build = this.build;
    const mainDom = this.mainDom;
    const textDom = this.textDom;
    const themeClassName = build.getThemeClassName();
    const styleClassName = build.getClassName();
    const borderClassName = build.getBorderClassName();
    const text = build.getProperty('text');
    const value = build.getProperty('value');
    textDom.textContent = value || text;
    mainDom.rowSpan = build.getRowSpan();
    mainDom.colSpan = build.getColSpan();
    themeClassName && mainDom.classList.add(themeClassName);
    styleClassName && mainDom.classList.add(styleClassName);
    borderClassName && mainDom.classList.add(borderClassName);
  }
}