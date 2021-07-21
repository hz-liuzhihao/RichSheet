import { IListener, AbsListener } from './BehaviorListener';
import { KeyMap } from '../utils/enums';

/**
 * 快捷键监听器
 */
export default class ShortcutListener extends AbsListener implements IListener {

  public dealKeyDown(event: KeyboardEvent) {
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const keyCode = event.keyCode || KeyMap[event.key];
    const isAlt = event.altKey;
    if (isCtrl && !isShift) {
      // 按住ctrl键未按shift键
      if (keyCode == 77) {
        event.preventDefault();
        this.ctrlM();
      } else if (keyCode == 89) {
        event.preventDefault();
        this.ctrlY();
      } else if (keyCode == 90) {
        event.preventDefault();
        this.ctrlZ();
      }
    } else if (!isCtrl && isShift) {
      // 按住shift键未按ctrl键
    } else if (isCtrl) {
      // 按住ctrl键且按住shift键
    } else {
      // 其他辅助键都没按住
    }
  }

  /**
   * ctrlM合并单元格
   */
  protected ctrlM() {
    const excelBuild = this.excelBuild;
    excelBuild.commond('mergeCell');
  }

  /**
   * redo
   */
  protected ctrlY() {
    const excelBuild = this.excelBuild;
    const undoManage = excelBuild.getUndoManage();
    undoManage.redo();
  }

  /**
   * undo
   */
  protected ctrlZ() {
    const excelBuild = this.excelBuild;
    const undoManage = excelBuild.getUndoManage();
    undoManage.undo();
  }
}