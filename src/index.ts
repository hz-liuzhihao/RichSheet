import { UndoManage, IWorkBench, UndoItem } from './flow/UndoManage';
import { ExcelBuild, ExcelMeta } from './build/ExcelBuild';
import ExcelEditor from './editor/ExcelEditor';
import './global.css';
import BehaviorListener from './controllers/BehaviorListener';
import { EmitBehavior } from './controllers/BehaviorListener';
import SelectListener from './controllers/SelectListener';
import RowColSizeListener from './controllers/RowColSizeListener';
import ShortcutListener from './controllers/ShortcutListener';

export interface SheetConfig {
  row: number;
  col: number;
}

interface WorkbenchArgs {
  config: RichSeetConfig;

  emitBehavior?: EmitBehavior
}
class Workbench implements IWorkBench {

  private undoManage: UndoManage;

  private excelBuild: ExcelBuild;

  private excelEditor: ExcelEditor;

  private behaviorListener: BehaviorListener;

  private emitBehavior: EmitBehavior;

  private config: RichSeetConfig;

  public constructor(args: WorkbenchArgs) {
    const config = this.config = args.config;
    this.emitBehavior = args.emitBehavior;
    config.onInit && config.onInit();
    // 初始化数据管理器
    this.initManage();
    // 初始化数据层
    this.initBuild();
    // 初始化UI层
    this.initEditor();
  }

  /**
   * 装载richsheet
   */
  public load() {
    const { dom, onLoad } = this.config;
    let domParent = dom;
    if (typeof dom == 'string') {
      domParent = document.getElementById(dom);
    }
    this.excelEditor.requestRender().then(() => {
      (domParent as HTMLElement).innerHTML = '';
      this.excelEditor.setParent(domParent as HTMLElement);
      onLoad && onLoad();
      this.initListener(domParent as HTMLElement)
    }).catch(() => {
      console.log('richsheet渲染失败');
    });
  }

  /**
   * 数据层变化时进行调用传递给UI层
   * @param undoItems 
   */
  doChange = (undoItems: UndoItem[]) => {
    undoItems.forEach(item => {
      this.excelEditor.requestRenderUndoItem(item);
    });
  }

  /**
   * 初始化数据管理器
   */
  private initManage() {
    this.undoManage = new UndoManage({
      workbench: this
    });
  }

  /**
   * 初始化数据层
   */
  private initBuild() {
    const config = this.config;
    this.excelBuild = new ExcelBuild({
      workbench: this,
      metaInfo: config.excel
    });
  }

  /**
   * 初始化编辑器
   */
  private initEditor() {
    this.excelEditor = new ExcelEditor({
      workbench: this,
      build: this.excelBuild
    });
  }

  /**
   * 初始化监听器
   */
  private initListener(dom: HTMLElement) {
    const emitBehavior = this.emitBehavior;
    this.behaviorListener = new BehaviorListener({
      listenDom: dom,
      emitBehavior,
      excelBuld: this.excelBuild
    });
    // 初始化选中监听器
    this.behaviorListener.addListener(new SelectListener(this.excelBuild));
    // 初始化行列大小监听器
    this.behaviorListener.addListener(new RowColSizeListener(this.excelBuild));
    // 初始化快捷键监听器
    this.behaviorListener.addListener(new ShortcutListener(this.excelBuild));
  }

  /** @override */
  public getUndoManage() {
    return this.undoManage;
  }

  /** @implements */
  public isDesign() {
    return this.config.isDesign == null ? true : this.config.isDesign;
  }
}

export interface RichSeetConfig {
  dom: string | HTMLElement;

  /**
   * 是否处于设计模式
   */
  isDesign?: boolean;

  /**
   * excel元数据
   */
  excel?: ExcelMeta;

  /**
   * 初始化函数
   */
  onInit?: () => void;

  /**
   * 加载钩子函数
   */
  onLoad?: () => void;
}

export default class RichSheet {

  private workbench: Workbench;

  public constructor(config: RichSeetConfig) {
    this.workbench = new Workbench({
      config
    });

    (window as any).workbench = this.workbench;
  }

  /**
   * 加载
   */
  public laod() {
    this.workbench.load();
  }
}