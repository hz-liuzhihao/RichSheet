import { BaseBuild, Operate, UndoItem, IWorkBench, BaseBuildArgs } from '../flow/UndoManage';
import { SheetBuild, SheetMeta } from './SheetBuild';
import { StyleBuild, StyleMeta } from './StyleBuild';
import { IExcelBehavior } from '../controllers/ToolBar';
import { ITheme, DefaultTheme, ThemeStyle } from '../controllers/Theme';
import { BorderStyleMeta, BorderStyleBuild } from './BorderStyleBuild';
import { CellPropertyBuild, CellPropertyMeta } from './CellPropertyBuild';
import { ExpressionBuild } from './ExpressionBuild';
import { CellBuild } from './CellBuild';

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
  cellPropertys?: CellPropertyMeta[];
}

type ExcelMetaKey = keyof ExcelMeta;

export interface ExcelBuildArgs extends BaseBuildArgs {
  workbench: IWorkBench;
}

/**
 * sheet的全局数据层
 * 包含sheet的一些共用数据,如样式,
 */
export class ExcelBuild extends BaseBuild<ExcelMeta> implements IExcelBehavior {

  private currentIndex: number;

  private sheets: SheetBuild[];

  private workbench: IWorkBench;

  private styleBuilds: StyleBuild[];

  private borderStyleBuilds: BorderStyleBuild[];

  private cellPropertyBuilds: CellPropertyBuild[];

  private expressionBuilds: ExpressionBuild[];

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
    this.cellPropertyBuilds = [];
    this.expressionBuilds = [];
    this.theme = Object.assign({}, DefaultTheme, this.metaInfo.theme || {});
    this.themeStyle = new ThemeStyle({
      theme: this.theme
    });
  }

  /**
   * 获取样式层列表
   * @returns 
   */
  public getStyleBuilds() {
    return this.styleBuilds;
  }

  public getStyleBuild(index: number) {
    return this.styleBuilds[index];
  }

  /**
   * 获取单元格属性数据层
   * @returns 
   */
  public getCellPropertyBuilds() {
    return this.cellPropertyBuilds;
  }

  public getCellPropertyBuild(index: number) {
    return this.cellPropertyBuilds[index];
  }

  /**
   * 获取边框样式数据层
   * @returns 
   */
  public getBorderBuilds() {
    return this.borderStyleBuilds;
  }

  public getBorderBuild(index: number) {
    return this.borderStyleBuilds[index];
  }

  /**
   * 获取表达式数据层
   * @returns 
   */
  public getExpressionBuilds() {
    return this.expressionBuilds;
  }

  /**
   * 获取表达式
   * @param index 
   * @returns 
   */
  public getExpressionBuild(index: number) {
    return this.expressionBuilds[index];
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
   * 获取undo/redo时的正确操作
   * @param undoItme 
   * @returns 
   */
  public getUndoRedoOperate(undoItme: UndoItem) {
    const undoManage = this.getUndoManage();
    const { op } = undoItme;
    if (undoManage.isRedo) {
      return op;
    } else {
      if (op == Operate.Add) {
        return Operate.Remove;
      } else if (op == Operate.Remove) {
        return Operate.Add;
      } else {
        return Operate.Modify;
      }
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
   * 初始化单元格属性数据层
   */
  protected initCellPropertys() {
    const metaInfo = this.metaInfo || {};
    const cellPropertys = metaInfo.cellPropertys || [];
    cellPropertys.forEach(item => {
      this.cellPropertyBuilds.push(new CellPropertyBuild({
        execelBuild: this,
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
    this.initCellPropertys();
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


  /** @override */
  public fallback(cmd: string, params: any[]) {
    const currentSheet = this.getCurrentSheet();
    currentSheet.commond(cmd, params);
  }

  /** @implements */
  public undo() {
    this.getUndoManage().undo();
  }

  /** @implements */
  public redo() {
    this.getUndoManage().redo();
  }

  /** @implements */
  public save() {

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

  /**
   * 是否处于设计阶段
   * @returns 
   */
  public isDesign() {
    return this.workbench.isDesign();
  }

  public setColor(color: string) {
    this.setStyleProperty('color', color);
  }

  /**
   * 设置样式属性方法
   * @param key 
   * @param value 
   * @param isCheck 
   */
  public setStyleProperty(key: keyof StyleMeta, value: any, isCheck: boolean = true) {
    const selectCells = this.getCurrentSheet().getSelectorCells();
    const styleBuildMap: {
      [key: string]: {
        style?: StyleBuild,
        length?: number,
        cells?: CellBuild[]
      }
    } = {};
    let currentStyleBuild = this.styleBuilds.find(item => item.isOnlyStyle(key, value));
    selectCells.forEach(item => {
      // 获取选中单元格的所有样式表
      const cellStyleBuild = item.getStyleBuild();
      // 如果单元格的样式规则刚好已经是的,就不在修改
      if (cellStyleBuild == currentStyleBuild) {
        return;
      }
      // 如果有单元格样式又不属于当前规则则需要另外处理
      if (cellStyleBuild) {
        const index = cellStyleBuild.getClassName();
        if (styleBuildMap[index] == null) {
          styleBuildMap[index] = {};
          styleBuildMap[index].length = 0;
          styleBuildMap[index].style = cellStyleBuild;
          styleBuildMap[index].cells = [];
        }
        styleBuildMap[index].length++;
        styleBuildMap[index].cells.push(item);
      } else {
        // 如果单元格本身就没有样式则需要添加样式表
        if (currentStyleBuild) {
          currentStyleBuild.addCell(item);
          item.setStyleBuild(currentStyleBuild);
        } else {
          currentStyleBuild = new StyleBuild({
            metaInfo: {
              [key]: value
            },
            excelBuild: this
          });
          // TODO 进行undo
          this.styleBuilds.push(currentStyleBuild);
          currentStyleBuild.addCell(item);
          item.setStyleBuild(currentStyleBuild);
        }
      }
    });
    for (const index in styleBuildMap) {
      // 如果当前选中的样式表的单元格长度刚好与样式表包含的单元格长度是一致的则样式表可以直接修改,且关联单元格不需要移除
      if (styleBuildMap[index].length == styleBuildMap[index].style.getCells().length) {
        const styleBuild = styleBuildMap[index].style;
        styleBuild.setProperty(key, value, isCheck);
      } else {
        // 如果不一致那么说明当前单元格必须做出修改,且新生成一个样式表
        const styleBuild = styleBuildMap[index].style;
        const metaInfo = styleBuild.toJSON();
        // 特殊样式处理
        if (key == 'textDecorationLine') {
          if (isCheck) {
            if (metaInfo.textDecorationLine) {
              metaInfo.textDecorationLine += ` ${value}`;
            } else {
              metaInfo.textDecorationLine = value;
            }
          } else {
            metaInfo.textDecorationLine && metaInfo.textDecorationLine.replace(value, '');
          }
        }
        const newStyleBuild = new StyleBuild({
          excelBuild: this,
          metaInfo
        });
        // TODO 进行undo
        this.styleBuilds.push(newStyleBuild);
        styleBuildMap[index].cells.forEach(item => {
          styleBuild.removeCell(item);
          newStyleBuild.addCell(item);
        });
      }
    }
  }

  /** @override */
  public toJSON() {
    const result = super.toJSON() as ExcelMeta;
    result.sheets = this.sheets.map(item => item.toJSON());
    return result;
  }
}