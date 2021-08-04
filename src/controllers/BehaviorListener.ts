import { ExcelBuild } from '../build/ExcelBuild';
import './listener.css';
import { setDomStyle } from '../utils/style';

export interface IListener {

  /**
   * 处理鼠标按下左键
   * @param event 
   */
  dealMouseDownLeft?(event: MouseEvent): void;

  /**
   * 处理鼠标按下右键
   * @param event 
   */
  dealMouseDownRight?(event: MouseEvent): void;

  /**
   * 处理鼠标移动
   * @param event 
   */
  dealMouseMove?(event: MouseEvent): void;

  /**
   * 处理鼠标抬起
   * @param event 
   */
  dealMouseUp?(event: MouseEvent): void;

  /**
   * 处理鼠标双击
   * @param event 
   */
  dealDbClick?(event: MouseEvent): void;

  /**
   * 处理鼠标单击
   */
  dealClick?(event: MouseEvent): void;

  /**
   * 处理快捷键
   * @param event 
   */
  dealKeyDown?(event: KeyboardEvent): void;
}

export abstract class AbsListener {

  protected excelBuild: ExcelBuild;

  public constructor(excelBuild: ExcelBuild) {
    this.excelBuild = excelBuild;
  }
}

/**
 * 通知用户行为接口
 */
export interface EmitBehavior {

  /**
   * 右键菜单
   */
  rightClick?: (event: MouseEvent) => void;
}

interface BehaviorListenerArgs {
  excelBuld: ExcelBuild;

  emitBehavior?: EmitBehavior;

  listenDom: HTMLElement;
}

/**
 * sheet所有的交互处理
 */
export default class BehaviorListener {

  private excelBuild: ExcelBuild;

  private emitBehavior: EmitBehavior = {};

  private listeners: IListener[];

  private downEvent: MouseEvent;

  private mouseEvent: MouseEvent;

  private timeout: any;

  private listenDom: HTMLElement;

  private shortCutDom: HTMLDivElement;

  public constructor(args: BehaviorListenerArgs) {
    this.excelBuild = args.excelBuld;
    this.emitBehavior = args.emitBehavior || {};
    this.listeners = [];
    this.listenDom = args.listenDom;
    this.initDom();
    this.initListen(args.listenDom);
  }

  /**
   * 初始化监听器需要的dom结构
   */
  protected initDom() {
    const shortCutDom = this.shortCutDom = document.createElement('div');
    shortCutDom.classList.add('behavior_shortcut');
    shortCutDom.contentEditable = 'true';
    this.listenDom.appendChild(shortCutDom);
  }

  /**
   * 添加监听器
   * @param listener 
   */
  public addListener(listener: IListener) {
    const index = this.listeners.indexOf(listener);
    if (index < 0) {
      this.listeners.push(listener);
      return this.listeners.length - 1;
    }
    return index;
  }

  /**
   * 移除监听器
   * @param listener 
   * @returns 
   */
  public removeListener(listener: IListener | number) {
    if (typeof listener == 'number') {
      return this.listeners.splice(listener, 1)[0];
    }
    const index = this.listeners.indexOf(listener);
    return this.listeners.splice(index, 1)[0];
  }

  /**
   * 初始化所有监听器
   * @param dom 
   */
  private initListen(dom: HTMLElement) {
    dom.addEventListener('dblclick', this.doDbClick);
    dom.addEventListener('click', this.doClick)
    dom.addEventListener('contextmenu', this.doContextMenu);
    dom.addEventListener('mousedown', this.doMouseDown);
    dom.addEventListener('mousemove', this.doMouseMove);
    document.addEventListener('mouseup', this.doMouseUp);
    this.shortCutDom.addEventListener('keydown', this.doKeyDown);
  }

  /**
   * 处理点击事件
   * @param event 
   */
  private doClick = (event: MouseEvent) => {
    this.listeners.forEach(item => {
      if (typeof item.dealClick == 'function') {
        item.dealClick(event);
      }
    });
  }

  /**
   * 双击
   * @param event 
   */
  private doDbClick = (event: MouseEvent) => {
    this.listeners.forEach(item => {
      if (typeof item.dealDbClick == 'function') {
        item.dealDbClick(event);
      }
    });
  }

  /**
   * 处理快捷键
   * @param event 
   */
  private doKeyDown = (event: KeyboardEvent) => {
    // 当触发tab健时阻止默认行为
    if (event.keyCode == 9 || event.key == 'Tab') {
      event.preventDefault();
    }
    this.listeners.forEach(item => {
      if (typeof item.dealKeyDown == 'function') {
        item.dealKeyDown(event);
      }
    });
  }

  /**
   * 处理右键菜单
   */
  private doContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const emitBehavior = this.emitBehavior;
    emitBehavior.rightClick && emitBehavior.rightClick(event);
  }

  /**
   * 鼠标按下
   * @param event 
   */
  private doMouseDown = (event: MouseEvent) => {
    if (event.button == 2) {
      // 右键点击触发事件
      this.listeners.forEach(item => {
        if (typeof item.dealMouseDownRight == 'function') {
          item.dealMouseDownRight(event);
        }
      });
      return;
    }
    this.downEvent = event;
    this.listeners.forEach(item => {
      if (typeof item.dealMouseDownLeft == 'function') {
        item.dealMouseDownLeft(event);
      }
    });
  }

  /**
   * 鼠标移动
   * @param event 
   */
  private doMouseMove = (event: MouseEvent) => {
    this.mouseEvent = event;
    if (this.downEvent && !this.timeout) {
      // 没100ms执行一次移动操作
      // this.timeout = setTimeout(() => {
      //   this.listeners.forEach(item => {
      //     if (typeof item.dealMouseMove == 'function') {
      //       item.dealMouseMove(this.mouseEvent);
      //     }
      //   });
      //   this.timeout = null;
      // }, 100);
      this.listeners.forEach(item => {
        if (typeof item.dealMouseMove == 'function') {
          item.dealMouseMove(this.mouseEvent);
        }
      });
    }
  }

  /**
   * 鼠标抬起
   * @param event 
   */
  private doMouseUp = (event: MouseEvent) => {
    this.downEvent = null;
    const srcElement = event.srcElement as HTMLElement;
    if (!document.activeElement.closest('.behavior_input') && srcElement.closest('.richsheet')) {
      this.shortCutDom.focus();
    }
    this.listeners.forEach(item => {
      if (typeof item.dealMouseUp == 'function') {
        item.dealMouseUp(event);
      }
    });
  }
}