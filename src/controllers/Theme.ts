import { AppConst } from '../config/constant';
import { uniqueId } from 'lodash';
import { addCssRule } from '../utils/style';
export interface ITheme {
  // 主颜色
  primaryColor?: string;
  // 次级颜色
  accentColor?: string;
  // 边框颜色
  borderColor?: string;
  // 边框风格
  borderStyle?: string;
  // 边框粗细
  borderWidth?: number;
  // 列头宽
  colHeadWidth?: number;
  // 列头高
  colHeadHeight?: number;
  // 行头宽
  rowHeadWidth?: number;
  // 行头高
  rowHeadHeight?: number;
}

/**
 * 默认主题
 */
export const DefaultTheme: ITheme = {
  primaryColor: '#1890ff',
  accentColor: '#fff',
  borderColor: '#d4d4d4',
  borderWidth: 1,
  borderStyle: 'solid',
  rowHeadHeight: 20,
  rowHeadWidth: 45,
  colHeadHeight: 20,
  colHeadWidth: 75
}

interface ThemeStyleArgs {
  theme: ITheme;
}

export class ThemeStyle {

  private theme: ITheme;

  private cellTheme: string;

  private rowHeadTheme: string;

  private colHeadTheme: string;

  public constructor(args: ThemeStyleArgs) {
    this.theme = args.theme;
  }

  /**
   * 获取单元格主题样式名
   */
  public getCellThemeClass() {
    if (this.cellTheme) {
      return this.cellTheme;
    }
    const theme = this.theme;
    const cellTheme = this.cellTheme = uniqueId(AppConst.classNamePrefix + 'theme_');
    const borderString = `${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor}`;
    const style = {
      borderLeft: borderString,
      borderBottom: borderString
    };
    addCssRule(cellTheme, style as CSSStyleDeclaration);
    return cellTheme;
  }

  /**
   * 获取行头主题样式名
   */
  public getRowHeadThemeClass() {

  }

  /**
   * 获取列头主题样式名
   */
  public getColHeadThemeClass() {

  }
}