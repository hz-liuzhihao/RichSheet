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
export function addCssRule(selector: string, rules: JSONObject = {}, suffix = '', type: 'class' | 'id' = 'class') {
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
  return globalSheet.insertRule(identify + selector + suffix + ruleStr);
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

/**
 * 设置dom样式
 * @param dom 
 * @param value 
 * @param unit 
 */
export function setDomStyle(dom: HTMLElement, style: JSONObject, unit: string = 'px') {
  for (const key of Object.keys(style)) {
    if (typeof style[key] == 'number') {
      dom.style[key as any] = `${style[key]}${unit}`;
    } else {
      dom.style[key as any] = style[key];
    }
  }
}