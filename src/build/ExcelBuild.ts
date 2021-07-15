import { BaseBuild, Operate, UndoItem, IWorkBench, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild, SheetMeta } from './SheetBuild';
import { StyleBuild, StyleMeta } from './StyleBuild';
import { ExcelBehavior } from '../controllers/ToolBar';
import { ITheme, DefaultTheme, ThemeStyle } from '../controllers/Theme';
import { BorderStyleMeta, BorderStyleBuild } from './BorderStyleBuild';

/**
 * excel元数据
 */
export interface ExcelMeta {
  // 默认行高度
  defaultRowHeight?: number;
  // 默认列宽度
  defaultColWidth?: number;
  defaultRows?: number;
  defaultCols?: number;
  theme?: ITheme;
  sheets?: SheetMeta[];
  styles?: StyleMeta[];
  borderStyles?: BorderStyleMeta[];
}

type ExcelMetaKey = keyof ExcelMeta;

export interface ExcelBuildArgs extends BaseBuildArgs {
  workbench: IWorkBench;
}

/**
 * sheet的全局数据层
 * 包含sheet的一些共用数据,如样式,
 */
export class ExcelBuild extends BaseBuild<ExcelMeta> implements ExcelBehavior {

  private currentIndex: number;

  private sheets: SheetBuild[];

  private workbench: IWorkBench;

  private styleBuilds: StyleBuild[];

  private borderStyleBuilds: BorderStyleBuild[];

  private theme: ITheme;

  private themeStyle: ThemeStyle;

  /**
   * 是否处于预览操作
   */
  private isPreview: boolean;

  public constructor(args: ExcelBuildArgs) {
    super(args);
  }

  /**
   * 初始化原始数据
   * @param args 
   */
  protected initData(args: ExcelBuildArgs) {
    this.workbench = args.workbench;
    this.sheets = [];
    this.styleBuilds = [];
    this.borderStyleBuilds = [];
    this.theme = Object.assign({}, DefaultTheme, this.metaInfo.theme || {});
    this.themeStyle = new ThemeStyle({
      theme: this.theme
    });
  }

  /**
   * 获取主题
   * @returns 
   */
  public getTheme() {
    return this.theme;
  }

  /**
   * 获取undo/redo的value,针对操作为modify
   * @param undoItem 
   * @returns 
   */
  public getUndoRedoValue(undoItem: UndoItem) {
    const undoManage = this.getUndoManage();
    const { v, ov } = undoItem;
    if (undoManage.isRedo) {
      return v;
    } else {
      return ov;
    }
  }

  /**
   * 获取主题样式表
   * @returns 
   */
  public getThemeStyle() {
    return this.themeStyle;
  }

  /**
   * 开始预览
   */
  public beginPreview() {
    this.isPreview = true;
  }

  /**
   * 结束预览
   */
  public endPreview() {
    this.isPreview = false;
  }

  /**
   * 获取预览状态
   * @returns 
   */
  public getIsPreview() {
    return this.isPreview;
  }

  /**
   * 初始化excel样式蓝图
   */
  protected initStyles() {
    const metaInfo = this.metaInfo || {};
    const styles = metaInfo.styles || [];
    styles.forEach(item => {
      this.styleBuilds.push(new StyleBuild({
        excelBuild: this,
        metaInfo: item
      }));
    });
  }

  public getStyleBuild(index: number) {
    return this.styleBuilds[index];
  }

  /**
   * 初始化excel边框样式蓝图
   */
  protected initBorderStyles() {
    const metaInfo = this.metaInfo || {};
    const borderStyles = metaInfo.borderStyles || [];
    borderStyles.forEach(item => {
      this.borderStyleBuilds.push(new BorderStyleBuild({
        excelBuild: this,
        metaInfo: item
      }));
    });
  }

  /**
   * 转换元数据
   * @override
   */
  protected initMeta() {
    const metaInfo = this.metaInfo || {};
    const sheets = metaInfo.sheets || [];
    this.initStyles();
    this.initBorderStyles();
    if (sheets.length == 0) {
      // 用户第一次使用richsheet,则为用户生成默认表格
      this.sheets.push(new SheetBuild({
        metaInfo: {},
        excelBuild: this
      }));
    } else {
      sheets.forEach(sheet => {
        this.sheets.push(new SheetBuild({
          metaInfo: sheet,
          excelBuild: this
        }));
      });
    }
  }

  /** @implements */
  restoreUndoItem(undoItem: UndoItem) {
    const op = undoItem.op;
    switch (op) {
      case Operate.Add:
        break;
      case Operate.Remove:
        break;
      case Operate.Modify:
        const key = undoItem.p;
        const value = this.getUndoRedoValue(undoItem);
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key as any, value);
        }
        break;
    }
  }

  /**
   * 添加行
   * @param count
   */
  public addRow(count: number) {
    // TOOD
  }

  /** @override */
  public merge() {
    this.getCurrentSheet().mergeCell();
  }

  /**
   * 获取所有的sheet
   * @returns 
   */
  public getSheets() {
    return this.sheets;
  }

  /**
   * 获取当前编辑sheet
   * @returns 
   */
  public getCurrentSheet() {
    return this.sheets[this.currentIndex || 0];
  }

  public getUndoManage() {
    return this.workbench.getUndoManage();
  }
}