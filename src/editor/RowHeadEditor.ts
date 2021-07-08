import BaseEditor from './BaseEditor';
import { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import './ColHeadEditor.css';
export interface RowHeadEditorArgs extends BaseEditorArgs {

}

export default class RowHeadEditor extends BaseEditor {

  protected build: RowBuild;

  public constructor(args: RowHeadEditorArgs) {
    args.type = 'td';
    super(args);
  }

  protected initDom() {
  }

  protected render() {
    const { mainDom, build } = this;
    const index = build.getProperty('index');
    Object.assign(mainDom.style, build.toStyle());
    mainDom.textContent = index;
    const rowHeadClass = build.getThemeClassName();
    rowHeadClass && mainDom.classList.add(rowHeadClass);
  }
}