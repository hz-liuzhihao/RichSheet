import { IListener, AbsListener } from './BehaviorListener';
import { ExcelBuild } from '../build/ExcelBuild';
import { RowBuild } from '../build/RowBuild';
import { ColBuild } from '../build/ColBuild';

export interface RowColSizeListenerArgs {
  excelBuild: ExcelBuild;
}

/**
 * 行列大小修改
 */
export default class RowColSizeListener extends AbsListener implements IListener {

  private lastPostion: Coordinate;

  private build: RowBuild | ColBuild;

  public dealMouseDownLeft(event: MouseEvent) {
    const { x, y } = event;
    this.lastPostion = {
      x,
      y
    };
    const srcElement = event.target as HTMLElement;
    const excelBuild = this.excelBuild;
    if (srcElement.closest('.row_head_drag')) {
      excelBuild.beginPreview();
      const buildDom: HTMLElement = srcElement.closest('.rowheadeditor_main');
      const build: RowBuild = buildDom.__build__;
      this.build = build;
    }
    if (srcElement.closest('.col_head_drag')) {
      excelBuild.beginPreview();
      const buildDom: HTMLElement = srcElement.closest('.colhead_item');
      const build: ColBuild = buildDom.__build__;
      this.build = build;
    }
  }

  public dealMouseMove(event: MouseEvent) {
    if (!this.build) {
      return;
    }
    const { x, y } = event;
    const build = this.build;
    const lastPosition = this.lastPostion;
    if (build instanceof RowBuild) {
      const oldHeight = build.getHeight();
      let value = oldHeight + y - lastPosition.y;
      if (value < 20) {
        value = 20;
      }
      build.setProperty('height', value);
    }

    if (build instanceof ColBuild) {
      const oldWidth = build.getWidth();
      let value = oldWidth + x - lastPosition.x;
      if (value < 30) {
        value = 30;
      }
      build.setProperty('width', value);
    }
  }

  public dealMouseUp(event: MouseEvent) {
    this.excelBuild.endPreview();
    if (!this.build) {
      return;
    }
    const { x, y } = event;
    const build = this.build;
    const lastPosition = this.lastPostion;
    if (build instanceof RowBuild) {
      if (Math.floor(Math.abs(y - lastPosition.y)) == 0) {
        return;
      }
      // 优化行高逻辑
      const oldHeight = build.getHeight();
      let value = oldHeight + y - lastPosition.y;
      if (value < 20) {
        value = 20;
      }
      build.setProperty('height', value);
    }

    if (build instanceof ColBuild) {
      if (Math.floor(Math.abs(x - lastPosition.x)) == 0) {
        return;
      }
      // 优化列宽逻辑
      const oldWidth = build.getWidth();
      let value = oldWidth + x - lastPosition.x;
      if (value < 30) {
        value = 30;
      }
      build.setProperty('width', value);
    }
    this.build = null;
    this.lastPostion = null;
  }
}