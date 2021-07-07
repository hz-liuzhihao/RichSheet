import BaseEditor from './BaseEditor';
import { BaseEditorArgs } from './BaseEditor';
import { ColBuild } from '../build/ColBuild';
export interface ColHeadEditorArgs extends BaseEditorArgs {

}

export default class ColHeadEditor extends BaseEditor {

  protected build: ColBuild;

  public constructor(args: ColHeadEditorArgs) {
    args.type = 'td';
    super(args);
  }

  protected initDom() {
  }

  protected render() {
    const { mainDom, build } = this;
    const index = build.getProperty('index');
    mainDom.textContent = index;
  }
}