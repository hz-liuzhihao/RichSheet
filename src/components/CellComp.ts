import BaseComp from './BaseComp';
import { BaseCompArgs } from './BaseComp';

export interface CellCompData {
  bgColor: string;
}

export interface CellCompArgs extends BaseCompArgs {
  data: CellCompData;
}

/**
 * 单元格组件
 */
export default class CellComp extends BaseComp<CellCompData> {

  protected mainDom: HTMLTableCellElement;

  public constructor(args: CellCompArgs) {
    super(args);
  }

  /**
   * 初始化dom结构
   */
  protected initDom() {
    this.mainDom = document.createElement('td');
  }

  /**
   * 渲染组件样式
   */
  private renderStyle() {
    const { mainDom: cellDom } = this;
    const { bgColor } = this.data;
    cellDom.style.backgroundColor = bgColor;

  }

  /**
   * 设置组件的父元素
   * @param dom 
   */
  public setParent(dom: HTMLElement) {
    dom.appendChild(this.mainDom);
  }

  /**
   * 渲染方法
   */
  protected render() {
    this.renderStyle();
  }

}