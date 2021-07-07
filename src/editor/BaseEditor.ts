import { BaseBuild } from '../flow/UndoManage';

export interface BaseEditorArgs {
  build: BaseBuild<any>;

  domParent?: HTMLElement;

  type?: keyof HTMLElementTagNameMap;
}

/**
 * 基础编辑器基类
 */
export default abstract class BaseEditor {

  protected build: BaseBuild<any>;

  protected mainDom: HTMLElement;

  protected parentDom: HTMLElement;

  public constructor(args: BaseEditorArgs) {
    this.initData(args);
    this.initMainDom(args.type);
    this.initDom();
    this.build = args.build;
    if (args.domParent) {
      args.domParent.appendChild(this.mainDom);
    }
  }

  /**
   * 初始化数据
   */
  protected initData(args: BaseEditorArgs) {

  }

  /**
   * 获取数据层
   * @returns 
   */
  public getBuild() {
    return this.build;
  }

  /**
   * 设置数据层
   * @param build 
   */
  public setBuild(build: any) {
    if (build == this.build) {
      return;
    }
    this.build = build;
    this.requestRender();
  }

  /**
   * 设置父元素
   * @param parentDom 
   * @returns 
   */
  public setParent(parentDom: HTMLElement) {
    if (this.parentDom == parentDom) {
      return;
    }
    parentDom.appendChild(this.mainDom);
  }

  /**
   * 初始化mainDom
   */
  protected initMainDom(type = 'div'): void {
    const mainDom = this.mainDom = document.createElement(type);
    mainDom.classList.add(`${this.constructor.name.toLowerCase()}_main`);
  }

  protected abstract initDom(): void;

  /**
   * 子类实现渲染方法
   */
  protected abstract render(): void;

  /**
   * 请求渲染
   * @returns 
   */
  public requestRender(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        this.render();
        resolve();
      });
    });
  }
}