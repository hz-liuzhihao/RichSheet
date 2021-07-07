import { UndoManage, IWorkBench, UndoItem } from './flow/UndoManage';
import { ExcelBuild, ExcelMeta } from './build/ExcelBuild';
import ExcelEditor from './editor/ExcelEditor';

export interface SheetConfig {
  row: number;
  col: number;
}

interface WorkbenchArgs {
  config: RichSeetConfig;
}
class Workbench implements IWorkBench {

  private undoManage: UndoManage;

  private excelBuild: ExcelBuild;

  private excelEditor: ExcelEditor;

  private config: RichSeetConfig;

  public constructor(args: WorkbenchArgs) {
    const config = this.config = args.config;
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
      this.excelEditor.setParent(domParent as HTMLElement);
      onLoad && onLoad();
    }).catch(() => {
      console.log('richsheet渲染失败');
    });
  }
  
  /**
   * 数据层变化时进行调用传递给UI层
   * @param undoItems 
   */
  doChange = (undoItems: UndoItem<any>[]) => {

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
    this.excelBuild = new ExcelBuild({
      workbench: this
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
}

export interface RichSeetConfig {
  dom: string | HTMLElement;

  excel: ExcelMeta;

  /**
   * 初始化函数
   */
  onInit: () => void;

  /**
   * 加载钩子函数
   */
  onLoad: () => void;
}

export default class RichSheet {

  private workbench: Workbench;

  public constructor(config: RichSeetConfig) {
    this.workbench = new Workbench({
      config
    });
  }
}