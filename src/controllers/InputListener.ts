import { AbsListener, IListener } from './BehaviorListener';
export default class InputListener extends AbsListener implements IListener {

  public dealClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();
    
  }

  public dealDbClick(event: MouseEvent) {
    const isDesign = this.excelBuild.isDesign();
  }
}