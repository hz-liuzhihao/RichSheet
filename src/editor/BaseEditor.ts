export interface BaseEditorArgs {
  // TODO 基础编辑器参数
}

/**
 * 基础编辑器基类
 */
export default abstract class BaseEditor {

  public constructor(args: BaseEditorArgs) {
    // TODO 基础编辑器初始化
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