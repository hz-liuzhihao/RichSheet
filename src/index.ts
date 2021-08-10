import { UndoManage, IWorkBench, UndoItem } from './flow/UndoManage';
import { ExcelBuild, ExcelMeta } from './build/ExcelBuild';
import ExcelEditor from './editor/ExcelEditor';
import './global.css';
import BehaviorListener from './controllers/BehaviorListener';
import { EmitBehavior } from './controllers/BehaviorListener';
import SelectListener from './controllers/SelectListener';
import RowColSizeListener from './controllers/RowColSizeListener';
import ShortcutListener from './controllers/ShortcutListener';
import { IExcelBehavior } from './controllers/ToolBar';
import { Behavior } from './utils/annotate';
import InputListener from './controllers/InputListener';
import { debounce } from 'lodash';

export interface SheetConfig {
  row: number;
  col: number;
}

interface WorkbenchArgs {
  config: RichSeetConfig;

  emitBehavior?: EmitBehavior
}

/**
 * excel行为暴露
 */
class ExcelBehavior implements IExcelBehavior {
  protected excelBuild: ExcelBuild;

  @Behavior
  public addRow(count?: number) { }

  @Behavior
  public deleteRow() { }

  @Behavior
  public addCol(count?: number) { }

  @Behavior
  public deleteCol() { }

  @Behavior
  public mergeCell() { }

  @Behavior
  public setBackgroundColor(color: string) {}

  @Behavior
  public getBackgroundColor(): any {}

  @Behavior
  public setColor(color: string) {}

  @Behavior
  public getColor(): any {}

  @Behavior
  public setFontFamily(fontFamily: string) {}

  @Behavior
  public getFontFamily(): any {}

  @Behavior
  public setFontSize(fontSize: number) {}

  @Behavior
  public getFontSize(): any {}

  @Behavior
  public setFontStyle(fontStyle: string) {}

  @Behavior
  public getFontStyle(): any {}

  @Behavior
  public setFontWeight(fontWeight: number) {}

  @Behavior
  public getFontWeight(): any {}

  @Behavior
  public setTextAlign(textAlign: string) {}

  @Behavior
  public getTextAlign(): any {}

  @Behavior
  public setVerticalAlign(verticalAlign: string) {}

  @Behavior
  public getVerticalAlign(): any {}

  @Behavior
  public setTextDecorationColor(color: string) {}

  @Behavior
  public getTextDecorationColor(): any {}

  @Behavior
  public setTextDecorationStyle(style: string) {}

  @Behavior
  public getTextDecorationStyle(): any {}

  @Behavior
  public setUnderline(underline: string) {}

  @Behavior
  public setOverline(overline: string) {}

  @Behavior
  public setLineThrough(lineThrough: string) {}

  public getCurrentStyleMap(): JSONObject {
    return this.excelBuild.getCurrentStyleMap();
  }
}

class Workbench extends ExcelBehavior implements IWorkBench, IExcelBehavior {

  private undoManage: UndoManage;

  protected excelBuild: ExcelBuild;

  private excelEditor: ExcelEditor;

  private behaviorListener: BehaviorListener;

  private emitBehavior: EmitBehavior;

  private config: RichSeetConfig;

  private refreshToolbarFunc: Function;

  public constructor(args: WorkbenchArgs) {
    super();
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
      const tableContainer = document.createElement('div');
      this.excelEditor.setParent(tableContainer);
      tableContainer.classList.add('table_container');
      (domParent as HTMLElement).appendChild(tableContainer);
      onLoad && onLoad();
      this.initListener(tableContainer)
    }).catch(() => {
      console.log('richsheet渲染失败');
    });
  }

  /**
   * 数据层变化时进行调用传递给UI层
   * @param undoItems 
   */
  doChange = (undoItems: UndoItem[]) => {
    if (typeof this.refreshToolbarFunc == 'function') {
      this.refreshToolbarFunc();
    }
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
    // 设计阶段需要初始化的监听器
    if (this.isDesign()) {
      // 初始化选中监听器
      this.behaviorListener.addListener(new SelectListener(this.excelBuild));
      // 初始化行列大小监听器
      this.behaviorListener.addListener(new RowColSizeListener(this.excelBuild));
    }
    // 初始化快捷键监听器
    this.behaviorListener.addListener(new ShortcutListener(this.excelBuild));
    // 初始化输入监听器
    this.behaviorListener.addListener(new InputListener({
      listenDom: dom,
      excelBuild: this.excelBuild
    }));
  }

  /** @override */
  public getUndoManage() {
    return this.undoManage;
  }

  /** @implements */
  public isDesign() {
    return this.config.isDesign == null ? true : this.config.isDesign;
  }

  public canUndo() {
    return this.undoManage.canUndo();
  }

  /** @implements */
  public canRedo() {
    return this.undoManage.canRedo();
  }

  /** @implements */
  public canSave() {
    return this.undoManage.canSave();
  }

  /** @implements */
  public undo() {
    this.undoManage.undo();
  }

  /** @implements */
  public redo() {
    this.undoManage.redo();
  }
  
  /** @implements */
  public save() {
    console.log(this.excelBuild.toJSON());
  }

  public addBahaviorChangeListener(func) {
    // 防抖
    this.refreshToolbarFunc = debounce(func, 100);
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
  public load() {
    this.workbench.load();
  }

  public getWorkbench() {
    return this.workbench;
  }
}