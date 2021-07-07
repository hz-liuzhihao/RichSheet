import { capitalize } from 'lodash';

export interface IWorkBench {
  doChange: (undoItems: UndoItem<any>[]) => void;
}

/**
 * 数据层基础参数
 */
export interface BaseBuildArgs {
  metaInfo: any;
}

/**
 * 数据层基类
 */
export abstract class BaseBuild<T> {

  protected metaInfo: T;

  public constructor(args: BaseBuildArgs) {
    this.metaInfo = args.metaInfo;
    this.initData(args);
    this.initMeta();
  }

  protected abstract initData(args: BaseBuildArgs): void;

  protected abstract initMeta(): void;


  /**
   * 恢复或者重做用户操作
   */
  public abstract restoreUndoItem(undoItem: UndoItem<T>): void;

  /**
   * 深度设置元数据值,如a.b.c.d
   * key a.b.c.d
   * value 'nihao'
   * metaInfo[a][b][c][d] = 'nihao'
   * @param key 
   * @param value 
   */
  public setDeepProperty(key: string, value: any) {
    const keys = key.split('.') as (keyof T)[]
    const method = keys.map((item) => capitalize(item as string)).join('');
    if (typeof this[method] == 'function') {
      return this[method]();
    }
    let lastOp = null;
    keys.forEach((item, index) => {
      if (index == 0) {
        lastOp = this.metaInfo[item];
      } else if (index == keys.length - 1) {
        lastOp[item] = value;
      } else {
        lastOp = lastOp[item];
      }
    });
  }

  /**
   * 设置元数据属性
   * @param key 
   * @param value 
   * @returns 
   */
  public setProperty(key: keyof T, value: any) {
    const method = `set${capitalize(key as string)}`;
    if (typeof this[method] == 'function') {
      return this[method]();
    }
    this.metaInfo[key] = value;
  }

  /**
   * 获取元数据属性
   * @param key 
   * @returns 
   */
  public getProperty(key: keyof T) {
    const method = `get${capitalize(key as string)}`;
    if (typeof this[method] == 'function') {
      return this[method]();
    }
    return this.metaInfo[key];
  }

  /**
   * 转换元数据
   */
  public toJSON() {
    return JSON.parse(JSON.stringify(this.metaInfo));
  }

  /**
   * 解析元数据
   */
  public parseJSON(data: JSONObject) {
    this.metaInfo = data as T;
  }


}

export enum Operate {
  /**
   * 添加
   */
  Add = 0,
  /**
   * 删除
   */
  Remove = 1,
  /**
   * 修改
   */
  Modify = 2
}

/**
 * 用户行为集合
 */
export interface UndoItem<T> {
  c: BaseBuild<T>,
  /**
   * 操作的行为
   */
  op: Operate;
  /**
   * 操作的属性
   */
  p: keyof T;
  /**
   * 操作的值
   */
  v: any;
  /**
   * 添加或者删除后的索引
   */
  i: number;
}

/**
 * 用户行为参数
 */
export interface UndoManageArgs {
  workbench: IWorkBench;
}

/**
 * 用户行为管理器
 */
export class UndoManage {

  public isUndo: boolean = false;

  public isRedo: boolean = false;

  private count: number;

  private undoItems: UndoItem<any>[][] = [];

  private redoItems: UndoItem<any>[][] = [];

  private curUndoItems: UndoItem<any>[] = [];

  private workbench: IWorkBench;

  public constructor(args: UndoManageArgs) {
    this.workbench = args.workbench;
  }

  /**
   * 处理redo操作
   */
  public redo(): void {
    this.isUndo = true;
  }

  /**
   * 处理undo操作
   */
  public undo(): void {
    this.isUndo = true;
    const curUndoItems = this.undoItems.pop();
    curUndoItems.forEach(item => {
      const c = item.c;
      c.restoreUndoItem(item);
    });
    this.isUndo = false;
    this.redoItems.push(curUndoItems);
  }

  /**
   * 开始更新
   */
  public beginUpdate(): void {
    this.count++;
  }

  /**
   * 结束更新
   */
  public endUpdate(): void {
    this.count--;
    if (this.count == 0) {
      this.undoItems.push(this.curUndoItems);
      this.curUndoItems = [];
      this.redoItems.length = 0;
    }
  }

  /**
   * 存储新的undoItem
   * @param undoItem 
   */
  public storeUndoItem(undoItem: UndoItem<any>) {
    if (this.isRedo || this.isUndo) {
      return;
    }
    if (this.count > 0) {
      this.curUndoItems.push(undoItem);
    }
  }

  /**
   * 是否可以undo
   * @returns 
   */
  public canUndo() {
    return this.undoItems.length > 0;
  }

  /**
   * 是否可以redo
   * @returns 
   */
  public canRedo() {
    return this.redoItems.length > 0;
  }
}