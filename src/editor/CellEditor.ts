import BaseEditor, { BaseEditorArgs } from './BaseEditor';
import { CellBuild } from '../build/CellBuild';
import './CellEditor.css';

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
   * 渲染每个undo信息
   */
   protected renderUndoItem() {
    this.needRenderUndoItems.forEach(item => {

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