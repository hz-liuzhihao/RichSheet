/**
 * 行为注解
 * @param target 
 * @param propertyKey 
 * @param descriptor 
 */
export function Behavior(target, propertyKey, descriptor) {
  descriptor.value = function(...params) {
    return this.excelBuild && this.excelBuild.commond(propertyKey, ...params);
  }
}