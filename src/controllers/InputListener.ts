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

  private inputContainer: HTMLElement;

  private listenDom: HTMLElement;

  public constructor(args: InputListenerArgs) {
    super(args.excelBuild);
    this.listenDom = args.listenDom;
    this.initDom();
  }

  protected initDom() {
    const inputDom = this.inputDom = document.createElement('div');
    const inputContainer = this.inputContainer = document.createElement('div');
    inputContainer.classList.add('behavior_container');
    inputDom.classList.add('behavior_input');
    inputDom.contentEditable = 'true';
    inputContainer.appendChild(inputDom);
    this.listenDom.appendChild(inputContainer);
  }

  private renderInput(inputArgs: InputArgs) {
    const inputContainer = this.inputContainer;
    setDomStyle(inputContainer, {
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
        const rowSpan = build.getRowSpan();
        const colSpan = build.getColSpan();
        const left = sheetBuild.getSelectLeft(col);
        const top = sheetBuild.getSelectTop(row);
        const width = sheetBuild.getSelectWidth(col, col + colSpan - 1);
        const height = sheetBuild.getSelectHeight(row, row + rowSpan - 1);
        this.renderInput({
          left,
          top,
          width,
          height
        });
        this.inputDom.focus();
      }
    }
  }
}