import { BaseBuild, BaseBuildArgs } from '../flow/UndoManage';
import { CellBuild } from './CellBuild';

/**
 * 单元格插件数据层
 * 1. 样式
 * 2. 交互
 * 3. 表达式等
 */
export default abstract class CellPluginBuild<T> extends BaseBuild<T> {

  private cells: CellBuild[];

  protected initData(args: BaseBuildArgs) {
    this.cells = [];
  }

  /**
   * 添加关联单元格
   * @param cell 
   */
  public addCell(cell: CellBuild) {
    this.cells.push(cell);
  }

  /**
   * 移除关联的单元格
   * @param cell 
   */
  public removeCell(cell: CellBuild) {
    const index = this.cells.indexOf(cell);
    this.cells.splice(index, 1);
  }

  /**
   * 获取样式层关联的所有单元格
   * @returns 
   */
   public getCells() {
    return this.cells;
  }
}