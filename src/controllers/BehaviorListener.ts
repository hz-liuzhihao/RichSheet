import { ExcelBuild } from '../build/ExcelBuild';
import { CellBuild } from '../build/CellBuild';
import { ColBuild } from '../build/ColBuild';
import { RowBuild } from '../build/RowBuild';
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
    const srcElement = event.target as HTMLElement;
    const isCtrl = event.ctrlKey;
    // 当按下的是单元格
    if (srcElement.closest('.celleditor_main')) {
      const cell: HTMLElement = srcElement.closest('.celleditor_main');
      const cellBuild: CellBuild = cell.__build__;
      const sheetBuild = cellBuild.getSheetBuild();
      sheetBuild.doSelect(cellBuild, cellBuild, isCtrl);
    }
    // 当按下的是列头
    if (srcElement.closest('.colhead_item')) {
      const colHead: HTMLElement = srcElement.closest('.colhead_item');
      const colHeadBuild: ColBuild = colHead.__build__;
      const sheetBuild = colHeadBuild.getSheetBuild();
      const cells = colHeadBuild.getCells();
      sheetBuild.doSelect(cells[0], cells[cells.length - 1], isCtrl);
    }
    // 当选中的是行头
    if (srcElement.closest('.rowheadeditor_main')) {
      const rowHead: HTMLElement = srcElement.closest('.rowheadeditor_main');
      const rowHeadBuild: RowBuild = rowHead.__build__;
      const sheetBuild = rowHeadBuild.getSheetBuild();
      const cells = rowHeadBuild.getCells();
      sheetBuild.doSelect(cells[0], cells[cells.length - 1], isCtrl);
    }
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