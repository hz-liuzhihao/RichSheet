import BaseEditor from './BaseEditor';
import { BaseEditorArgs } from './BaseEditor';
import { ColBuild } from '../build/ColBuild';
export interface ColHeadEditorArgs extends BaseEditorArgs {

}

export default class ColHeadEditor extends BaseEditor {

  public constructor(args: ColHeadEditorArgs) {
    args.type = 'td';
    super(args);
  }

  protected initDom() {
    const mainDom = this.mainDom;
  }

  protected render() {

  }
}