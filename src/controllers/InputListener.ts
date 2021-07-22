import { AbsListener, IListener } from './BehaviorListener';
import { ExcelBuild } from '../build/ExcelBuild';
import { setDomStyle } from '../utils/style';
import { CellBuild } from '../build/CellBuild';

interface InputArgs {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface InputListenerArgs {
  listenDom: HTMLElement;

  excelBuild: ExcelBuild;
}
export default class InputListener extends AbsListener implements IListener {

  private inputDom: HTMLDivElement;

  private listenDom: HTMLElement;

  public constructor(args: InputListenerArgs) {
    super(args.excelBuild);
    this.listenDom = args.listenDom;
    this.initDom();
  }

  protected initDom() {
    const inputDom = this.inputDom = document.createElement('div');
    inputDom.classList.add('behavior_input');
    inputDom.contentEditable = 'true';
    document.body.appendChild(inputDom);
  }

  private renderInput(inputArgs: InputArgs) {
    const inputDom = this.inputDom;
    setDomStyle(inputDom, {
      top: inputArgs.top,
      left: inputArgs.left,
      width: inputArgs.width,
      height: inputArgs.height
    });
  }

  public dealClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();

  }

  /**
   * 设计层时双击进行输入
   * @param event 
   */
  public dealDbClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();
    const srcElement = event.target as HTMLElement;
    const isCtrl = event.ctrlKey;
    if (isDesign) {
      if (srcElement.closest('.celleditor_main')) {
        const cell: HTMLElement = srcElement.closest('.celleditor_main');
        const build: CellBuild = cell.__build__;
        const sheetBuild = build.getSheetBuild();
        const row = build.getRow();
        const col = build.getCol();
        const left = sheetBuild.getSelectLeft(col);
        const top = sheetBuild.getSelectTop(row);
        this.renderInput({
          left,
          top,
          width: 100,
          height: 40
        });
        this.inputDom.focus();
      }
    }
  }
}