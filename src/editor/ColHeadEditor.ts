import BaseEditor from './BaseEditor';
import { BaseEditorArgs } from './BaseEditor';
import { RowBuild } from '../build/RowBuild';
import './ColHeadEditor.css';
export interface ColHeadEditorArgs extends BaseEditorArgs {

}

export default class ColHeadEditor extends BaseEditor {

  protected build: RowBuild;

  public constructor(args: ColHeadEditorArgs) {
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
  }
}