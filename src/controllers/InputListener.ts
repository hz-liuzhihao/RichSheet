import { AbsListener, IListener } from './BehaviorListener';
export default class InputListener extends AbsListener implements IListener {

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
        const textDom = cell.getElementsByClassName('cell_text')[0] as HTMLElement;
        textDom.focus();
      }
    }
  }
}