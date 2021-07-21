/**
 * 命令控制器
 */
export default abstract class CommondProvider {

  /**
   * 执行当前cmd指令
   * @param cmd 
   * @param params 
   */
  public commond(cmd: string, params: any[]) {
    if (typeof this[cmd] == 'function') {
      this[cmd](...params);
    } else {
      this.fallback(cmd, params);
    }
  }

  /**
   * 如果当前没有cmd指令则会继续向下执行子指令
   * @param cmd 
   * @param params 
   */
  public abstract fallback(cmd: string, params: any[]);
}