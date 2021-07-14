import { IListener, AbsListener } from './BehaviorListener';

/**
 * 快捷键监听器
 */
export default class ShortcutListener extends AbsListener implements IListener {

  public dealKeyDown(event: KeyboardEvent) {
    const isCtrl = event.ctrlKey;
    const isShift = event.shiftKey;
    const keyCode = event.keyCode || event.key;
    const isMeta = event.metaKey;
    const isAlt = event.altKey;
    console.log(event.key + ': ' + event.keyCode);
  }

  /**
   * ctrlM快捷操作
   */
  protected ctrlM() {

  }
}