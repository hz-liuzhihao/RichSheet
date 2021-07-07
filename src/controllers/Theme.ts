export interface ITheme {
  // 主颜色
  primaryColor?: string;
  // 次级颜色
  accentColor?: string;
  // 边框颜色
  borderColor?: string;
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
  borderColor: '#dedede',
  borderWidth: 1,
  rowHeadHeight: 30,
  rowHeadWidth: 50,
  colHeadHeight: 30,
  colHeadWidth: 50
}