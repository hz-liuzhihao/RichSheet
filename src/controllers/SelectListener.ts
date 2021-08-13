import { IListener, AbsListener } from './BehaviorListener';
import { BaseBuild } from '../flow/UndoManage';
import { CellBuild } from '../build/CellBuild';
import { ColBuild } from '../build/ColBuild';
import { RowBuild } from '../build/RowBuild';
/**
 * 选中监听器
 */
export default class SelectListener extends AbsListener implements IListener {

  private downBuild: BaseBuild<any>;

  private moveBuild: BaseBuild<any>;

  public dealMouseDownLeft(event: MouseEvent) {
    const srcElement = event.target as HTMLElement;
    const isCtrl = event.ctrlKey;
    // 当按下的是单元格
    if (srcElement.closest('.celleditor_main')) {
      const cell: HTMLElement = srcElement.closest('.celleditor_main');
      const cellBuild: CellBuild = cell.__build__;
      if (this.downBuild == cellBuild) {
        return;
      }
      this.downBuild = cellBuild;
      const sheetBuild = cellBuild.getSheetBuild();
      sheetBuild.doSelect(cellBuild, cellBuild, isCtrl);
      return;
    }
    // 当按下的是列头
    if (srcElement.closest('.colhead_item')) {
      const colHead: HTMLElement = srcElement.closest('.colhead_item');
      const colHeadBuild: ColBuild = colHead.__build__;
      if (this.downBuild == colHeadBuild) {
        return;
      }
      this.downBuild = colHeadBuild;
      const sheetBuild = colHeadBuild.getSheetBuild();
      const cells = colHeadBuild.getCells();
      if (cells.length != 0) {
        sheetBuild.doSelect(cells[0], cells[cells.length - 1], isCtrl);
      }
      return;
    }
    // 当选中的是行头
    if (srcElement.closest('.rowheadeditor_main')) {
      const rowHead: HTMLElement = srcElement.closest('.rowheadeditor_main');
      const rowHeadBuild: RowBuild = rowHead.__build__;
      if (this.downBuild == rowHeadBuild) {
        return;
      }
      this.downBuild = rowHeadBuild;
      const sheetBuild = rowHeadBuild.getSheetBuild();
      const cells = rowHeadBuild.getCells();
      if (cells.length != 0) {
        sheetBuild.doSelect(cells[0], cells[cells.length - 1], isCtrl);
      }
      return;
    }
  }

  public dealMouseDownRight(event: MouseEvent) {
    const srcElement = event.target as HTMLElement;
    const isCtrl = event.ctrlKey;
    if (srcElement.closest('.celleditor_main')) {
      const cell: HTMLElement = srcElement.closest('.celleditor_main');
      const cellBuild: CellBuild = cell.__build__;
      if (this.downBuild == cellBuild) {
        return;
      }
      this.downBuild = cellBuild;
      const sheetBuild = cellBuild.getSheetBuild();
      if (sheetBuild.isSelect(cellBuild)) {
        return;
      }
      sheetBuild.doSelect(cellBuild, cellBuild, isCtrl);
    }
  }

  public dealDbClick(event: MouseEvent) {

  }

  public dealMouseMove(event: MouseEvent) {
    const srcElement = event.target as HTMLElement;
    // 存在按下的单元格数据层才算拖拽行为
    if (this.downBuild && this.downBuild instanceof CellBuild && srcElement.closest('.celleditor_main')) {
      const isCtrl = event.ctrlKey;
      const currentCell: HTMLElement = srcElement.closest('.celleditor_main');
      const currentCellBuild: CellBuild = currentCell.__build__;
      if (this.moveBuild == currentCellBuild) {
        return;
      }
      const sheetBuild = currentCellBuild.getSheetBuild();
      sheetBuild.doSelect(this.downBuild, currentCellBuild, isCtrl);
    }
  }

  public dealMouseUp(event: MouseEvent) {
    this.downBuild = null;
  }
}