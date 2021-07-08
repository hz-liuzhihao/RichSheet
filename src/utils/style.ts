import { kebabCase } from 'lodash';

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
export function addCssRule(selector: string, rules: JSONObject = {}, type: 'class' | 'id' = 'class') {
  if (globalSheet == null) {
    globalSheet = createStyleSheet();
  }
  let identify;
  if (type) {
    identify = type == 'class' ? '.' : '#';
  } else {
    identify = '';
  }
  let ruleStr = '{';
  for (const key of Object.keys(rules)) {
    ruleStr += `${kebabCase(key)}:${rules[key]};`;
  }
  ruleStr += '}';
  return globalSheet.insertRule(".rs_theme_1{border-left:1 solid #d4d4d4;border-bottom:1 solid #d4d4d4;}");
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
