import { BaseBuild, Operate, UndoItem } from '../flow/UndoManage';

export interface ExpressionMeta {
  /**
   * 单元格值
   * 表达式 表达式为js环境,如=SUM(${cell1}:${cell2}) 编译时应该将${cell1}和${cell2}编译出结果
   * 非等号开头
   * 等号开头
   */
  value: string;
}

type ExpressionMetaKey = keyof ExpressionMeta;

export class ExpressionBuild extends BaseBuild<ExpressionMeta> {

  restoreUndoItem(undoItem: UndoItem<ExpressionMeta>) {
    const op = undoItem.op;
    switch (op) {
      case Operate.Add:
        break;
      case Operate.Remove:
        break;
      case Operate.Modify:
        const key = undoItem.p;
        const value = undoItem.v;
        if ((key as string).indexOf('.') > -1) {
          this.setDeepProperty(key, value);
        } else {
          this.setProperty(key, value);
        }
        break;
    }
  };

  /**
   * 获取表达式解析后的文本
   */
  public getRenderText() {
    return '';
  }


}