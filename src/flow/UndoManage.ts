import { upperFirst } from 'lodash';
import CommondProvider from '../controllers/CommondProvider';

export interface IWorkBench {
  /**
   * undo改变后触发
   */
  doChange: (undoItems: UndoItem[]) => void;

  /**
   * 获取undo
   */
  getUndoManage: () => UndoManage;

  /**
   * 是否处于设计模式
   */
  isDesign: () => boolean;
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
export abstract class BaseBuild<T> extends CommondProvider {

  protected metaInfo: T;

  public constructor(args: BaseBuildArgs) {
    super();
    this.metaInfo = args.metaInfo || {};
    this.initData(args);
    this.initMeta();
  }

  protected abstract initData(args: BaseBuildArgs): void;

  protected abstract initMeta(): void;


  /**
   * 恢复或者重做用户操作
   */
  public abstract restoreUndoItem(undoItem: UndoItem): void;

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
    const method = keys.map((item) => upperFirst(item as string)).join('');
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
    const method = `set${upperFirst(key as string)}`;
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
    const method = `get${upperFirst(key as string)}`;
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
  Modify = 2,

  /**
   * 一次查询操作,对数据不产生影响,不记录undo信息只产生临时的undoItem
   */
  Query = 4,
}

/**
 * 用户行为集合
 */
export interface UndoItem {
  c: BaseBuild<any>,
  /**
   * 操作的行为
   */
  op: Operate;
  /**
   * 操作的属性
   */
  p?: string;
  /**
   * 操作的值
   */
  v: any;
  /**
   * 旧值
   */
  ov?: any;
  /**
   * 添加或者删除后的索引
   */
  i?: number;
  /**
   * 是否预览
   */
  isPreview?: boolean;
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

  private count: number = 0;

  private undoItems: UndoItem[][] = [];

  private redoItems: UndoItem[][] = [];

  private curUndoItems: UndoItem[] = [];

  // 查询undoItem集合
  private qurUndoItems: UndoItem[] = [];

  private workbench: IWorkBench;

  public constructor(args: UndoManageArgs) {
    this.workbench = args.workbench;
  }

  /**
   * 处理redo操作
   */
  public redo(): void {
    if (!this.canRedo()) {
      return;
    }
    this.isRedo = true;
    const curUndoItems = this.redoItems.pop();
    curUndoItems.forEach(item => {
      const c = item.c;
      c.restoreUndoItem(item);
    });
    this.workbench.doChange([...curUndoItems]);
    this.isRedo = false;
    this.undoItems.push(curUndoItems);
  }

  /**
   * 处理undo操作
   */
  public undo(): void {
    if (!this.canUndo()) {
      return;
    }
    this.isUndo = true;
    const curUndoItems = this.undoItems.pop();
    curUndoItems.forEach(item => {
      const c = item.c;
      c.restoreUndoItem(item);
    });
    this.workbench.doChange([...curUndoItems]);
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
      if (this.curUndoItems.length) {
        this.undoItems.push(this.curUndoItems);
      }
      // 在进行数据驱动渲染时,需要将查询操作一起合并
      this.workbench.doChange([...this.qurUndoItems, ...this.curUndoItems]);
      if (this.curUndoItems.length > 0) {
        this.redoItems.length = 0;
      }
      this.curUndoItems = [];
      this.qurUndoItems = [];
    }
  }

  /**
   * 存储新的undoItem
   * @param undoItem 
   */
  public storeUndoItem(undoItem: UndoItem) {
    if (this.isRedo || this.isUndo) {
      return;
    }
    // 只有在进行beginUpdate指令后才进行操作
    if (this.count > 0) {
      // 凡是查询操作不记录undo信息
      if (undoItem.op == Operate.Query || undoItem.isPreview) {
        this.qurUndoItems.push(undoItem);
      } else {
        this.curUndoItems.push(undoItem);
      }
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