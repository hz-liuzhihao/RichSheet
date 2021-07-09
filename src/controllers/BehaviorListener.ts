import { ExcelBuild } from '../build/ExcelBuild';
/**
 * 通知用户行为接口
 */
export interface EmitBehavior {

  /**
   * 右键菜单
   */
  rightClick(event: MouseEvent): void;
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

  private emitBehavior: EmitBehavior;

  private isDragging: boolean;

  public constructor(args: BehaviorListenerArgs) {
    this.excelBuild = args.excelBuld;
    this.emitBehavior = args.emitBehavior;
    this.isDragging = false;
    this.initListen(args.listenDom);
  }

  /**
   * 初始化所有监听器
   * @param dom 
   */
  private initListen(dom: HTMLElement) {
    dom.addEventListener('contextmenu', this.doContextMenu);
    dom.addEventListener('mousedown', this.doMouseDown);
    dom.addEventListener('mousemove', this.doMouseMove);
    dom.addEventListener('mouseup', this.doMouseUp);
  }

  /**
   * 处理右键菜单
   */
  private doContextMenu = (event: MouseEvent) => {
    const emitBehavior = this.emitBehavior;
    emitBehavior.rightClick && emitBehavior.rightClick(event);
  }

  /**
   * 鼠标按下
   * @param event 
   */
  private doMouseDown = (event: MouseEvent) => {
    console.log('鼠标按下成功监听');
  }

  /**
   * 鼠标移动
   * @param event 
   */
  private doMouseMove = (event: MouseEvent) => {
    console.log('鼠标移动成功监听');
  }

  /**
   * 鼠标抬起
   * @param event 
   */
  private doMouseUp = (event: MouseEvent) => {
    console.log('鼠标抬起成功监听');
  }
}