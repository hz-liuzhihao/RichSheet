import { BaseBuild, UndoItem, IWorkBench } from '../flow/UndoManage';

export interface BaseEditorArgs {
  build: BaseBuild<any>;

  workbench: IWorkBench;

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

  protected renderPromise: Promise<void>;

  protected renderUndoPromise: Promise<void>;

  protected needRenderUndoItems: UndoItem[];

  protected acceptDom: any[];

  protected workbench: IWorkBench;

  public constructor(args: BaseEditorArgs) {
    this.initData(args);
    this.initMainDom(args.type);
    this.initDom();
    if (args.domParent) {
      args.domParent.appendChild(this.mainDom);
    }
  }

  /**
   * 初始化数据
   */
  protected initData(args: BaseEditorArgs) {
    this.workbench = args.workbench;
    this.build = args.build;
    this.parentDom = args.domParent;
    this.needRenderUndoItems = [];
    this.acceptDom = [];
  }

  /**
   * 移除元素
   */
  public removeDom() {
    this.mainDom.remove();
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
    this.mainDom.__build__ = build;
    this.build = build;
    this.requestRender();
  }

  /**
   * 设置父元素
   * @param parentDom 
   * @returns 
   */
  public setParent(parentDom: HTMLElement) {
    if (this.parentDom == parentDom && this.mainDom.parentElement) {
      return;
    }
    this.parentDom = parentDom;
    parentDom.appendChild(this.mainDom);
  }

  /**
   * 初始化mainDom
   */
  protected initMainDom(type = 'div'): void {
    const mainDom = this.mainDom = document.createElement(type);
    (mainDom as any).__build__ = this.build;
    mainDom.classList.add(`${this.constructor.name.toLowerCase()}_main`);
  }

  protected abstract initDom(): void;

  /**
   * 子类实现渲染方法
   */
  protected abstract render(): void;

  protected abstract renderUndoItem(): void;

  /**
   * 请求全量渲染
   * @returns 
   */
  public requestRender(): Promise<void> {
    if (this.renderPromise) {
      return this.renderPromise;
    }
    return this.renderPromise = new Promise(resolve => {
      requestAnimationFrame(() => {
        this.render();
        this.renderPromise = null;
        resolve();
      });
    });
  }

  /**
   * 请求渲染undoItem
   * @param undoItem 
   * @returns 
   */
  public requestRenderUndoItem(undoItem: UndoItem) {
    this.requestRenderChildrenUndoItem(undoItem);
    // 只渲染当前数据层有修改的
    if (typeof this.renderBuild == 'function') {
      this.renderBuild(undoItem);
    } else {
      if (undoItem.c !== this.build) {
        return;
      }
      this.needRenderUndoItems.push(undoItem);
    }
    if (this.renderPromise) {
      return this.renderPromise;
    }
    return this.renderUndoPromise = new Promise(resolve => {
      requestAnimationFrame(() => {
        this.renderUndoItem();
        this.renderUndoPromise = null;
        this.needRenderUndoItems = [];
        resolve();
      });
    });
  }

  /**
   * 渲染数据层
   * @param undoItem 
   */
  protected renderBuild?(undoItem: UndoItem): void;

  /**
   * 请求渲染子编辑器
   * 如果编辑器包含了子编辑器需要向下传递则调用此方法
   */
  protected requestRenderChildrenUndoItem(undoItem: UndoItem) {
  }

  /**
   * 获取主元素
   * @returns 
   */
  public getMainDom(): HTMLElement {
    return this.mainDom;
  }
}