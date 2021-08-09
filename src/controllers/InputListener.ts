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

  private inputMain: HTMLElement;

  private listenDom: HTMLElement;

  private cellBuild: CellBuild;

  private cellTextEle: HTMLElement;

  private cellContent: string;

  public constructor(args: InputListenerArgs) {
    super(args.excelBuild);
    this.listenDom = args.listenDom;
    this.initDom();
  }

  protected initDom() {
    const inputMain = this.inputMain = document.createElement('div');
    const inputDom = this.inputDom = document.createElement('div');
    const inputContainer = document.createElement('div');
    inputMain.classList.add('input_main');
    inputContainer.classList.add('cell_text_container');
    inputDom.classList.add('cell_text');
    inputDom.contentEditable = 'true';
    inputDom.onblur = () => {
      this.cellTextEle.textContent = this.cellContent;
      // 一定要把引用的dom置为null否则永远无法清除
      this.cellTextEle = null;
      this.inputMain.style.display = 'none';
      this.inputMain.classList.remove(this.cellBuild.getThemeClassName());
      this.cellBuild.getClassName() && this.inputMain.classList.remove(this.cellBuild.getClassName());
      this.cellBuild.inputValue(this.inputDom.textContent || null);
    }
    inputMain.appendChild(inputContainer);
    inputContainer.appendChild(inputDom);
    this.listenDom.appendChild(inputMain);
  }

  private renderInput(inputArgs: InputArgs) {
    const inputMain = this.inputMain;
    setDomStyle(inputMain, {
      top: inputArgs.top,
      left: inputArgs.left,
      width: inputArgs.width,
      height: inputArgs.height
    });
  }

  public dealClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();
    if (!isDesign) {
      this.input(event);
    }
  }

  /**
   * 进行输入
   * @param event 
   */
  public input(event: MouseEvent) {
    const srcElement = event.target as HTMLElement;
    const isDesign = this.excelBuild.isDesign();
    if (srcElement.closest('.celleditor_main')) {
      const cell: HTMLElement = srcElement.closest('.celleditor_main');
      const cellTextHtml = this.cellTextEle = cell.getElementsByClassName('cell_text')[0] as HTMLElement;
      this.cellContent = cellTextHtml.textContent;
      cellTextHtml.textContent = '';
      const build: CellBuild = this.cellBuild = cell.__build__;
      if (!build) {
        return;
      }
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
      if (isDesign) {
        this.inputDom.textContent = build.getProperty('text');
      } else {
        this.inputDom.textContent = build.getProperty('value');
      }
      this.inputMain.classList.add(this.cellBuild.getThemeClassName());
      this.cellBuild.getClassName() && this.inputMain.classList.add(this.cellBuild.getClassName());
      this.inputMain.style.display = 'flex';
      this.inputDom.focus();
    }
  }

  /**
   * 设计层时双击进行输入
   * @param event 
   */
  public dealDbClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();
    if (isDesign) {
      this.input(event);
    }
  }
}