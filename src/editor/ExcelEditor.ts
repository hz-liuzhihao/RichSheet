import BaseEditor from './BaseEditor';
import { IWorkBench } from '../flow/UndoManage';
import { ExcelBuild } from '../build/ExcelBuild';

export interface ExcelEditorArgs {
  workbench: IWorkBench;

  build: ExcelBuild;
}

export default class ExcelEditor extends BaseEditor {

  private workbench: IWorkBench;

  private build: ExcelBuild;

  public constructor(args: ExcelEditorArgs) {
    super(args);
    this.workbench = args.workbench;
    this.build = args.build;
  }

  render() {
    
  }
}