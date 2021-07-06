
export interface BaseCompArgs {
  domParent: HTMLElement;

  data: any;
}

/**
 * 组件基类
 */
export default abstract class BaseComp<T> {

  protected data: T;

  protected mainDom: HTMLElement;

  public constructor(args: BaseCompArgs) {
    this.initDom();
    this.data = args.data;
    if (args.domParent) {
      args.domParent.appendChild(this.mainDom);
    }
  }

  protected abstract initDom(): void;

  /**
   * 设置组件数据层
   * @param data 
   */
  public setData(data: T) {
    this.data = data;
    this.requestRender();
  }

  /**
   * 获取数据层
   * @returns 
   */
  public getData() {
    return this.data;
  }

  /**
   * 子类实现渲染方法
   */
   protected abstract render(): void;

   /**
    * 请求渲染
    * @returns 
    */
   protected requestRender(): Promise<void> {
     return new Promise(resolve => {
       requestAnimationFrame(() => {
         this.render();
         resolve();
       });
     });
   }
}