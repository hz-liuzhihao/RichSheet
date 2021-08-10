interface JSONObject {
  [key: string]: any;
}

declare module '*.less' {
  const content: any;
  export default content;
}

declare const enum BorderStyle {
  Solid = 0,
  Dashed = 1,
  Dotted = 2
}

declare const enum Position {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3
}

interface PositionInfo {
  left: number;
  top: number;
  width?: number;
  height?: number;
  right?: number;
  bottom?: number;
}

interface BackgroundMeta {
  color: string;
  img: string;
}

interface FontMeta {
  size: number;
  color: string;
  weight: number;
  family: string;
}

declare const enum Align {
  FlexStart = 0,
  Center = 1,
  FlexEnd = 2
}

interface StyleMeta {
  /**
   * 次轴布局
   */
  alignItems: Align;
  /**
   * 主轴布局
   */
  justifyContent: Align;

  /**
   * 背景
   */
  background: BackgroundMeta;

  /**
   * 字体设置
   */
  font: FontMeta;
}

/**
 * 坐标
 */
interface Coordinate {
  /**
   * 横向坐标
   */
  x: number;

  /**
   * 纵向坐标
   */
  y: number;
}

interface HTMLElement {
  __build__: any;
  __editor__: any;
}

interface CSSStyleDeclaration {
  underline: string;
  overline: string;
  lineThrough: string;
}