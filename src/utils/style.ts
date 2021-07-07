/**
 * 创建一个style,返回其 stylesheet 对象
 */

export function createStyleSheet() {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  return style.sheet;
}

let globalSheet: CSSStyleSheet;
/**
 * 添加样式规则
 * @param selector 
 * @param rules 
 * @param index 
 * @returns 
 */
export function addCssRule(selector: string, rules: CSSStyleDeclaration) {
  if (globalSheet == null) {
    globalSheet = createStyleSheet();
  }
  return globalSheet.insertRule(selector + JSON.stringify(rules));
}

/**
 * 删除样式规则
 * @param index 
 * @returns 
 */
export function deleteCssRule(index: number) {
  if (globalSheet == null) {
    globalSheet = createStyleSheet();
  }
  return globalSheet.deleteRule(index);
}
