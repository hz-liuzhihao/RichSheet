import BaseComp from './BaseComp';
import { BaseCompArgs } from './BaseComp';

export interface CellCompArgs extends BaseCompArgs {

}

/**
 * 单元格组件
 */
export default class CellComp extends BaseComp {

  

  public constructor(args: CellCompArgs) {
    super(args);
  }
}