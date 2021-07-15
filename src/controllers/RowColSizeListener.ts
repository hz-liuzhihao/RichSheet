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
    excelBuild.beginPreview();
    if (srcElement.closest('.row_head_drag')) {
      const buildDom: HTMLElement = srcElement.closest('.rowheadeditor_main');
      const build: RowBuild = buildDom.__build__;
      this.build = build;
    }
    if (srcElement.closest('.col_head_drag')) {
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
      build.setProperty('height', oldHeight + y - lastPosition.y);
    }

    if (build instanceof ColBuild) {
      const oldWidth = build.getWidth();
      build.setProperty('width', oldWidth + x - lastPosition.x);
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
      const oldHeight = build.getHeight();
      build.setProperty('height', oldHeight + y - lastPosition.y);
    }

    if (build instanceof ColBuild) {
      const oldWidth = build.getWidth();
      build.setProperty('width', oldWidth + x - lastPosition.x);
    }
    this.build = null;
    this.lastPostion = null;
  }
}