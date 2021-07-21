import RichSheet from '../../src/index';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { IWorkBench } from '../../src/flow/UndoManage';
class TableContainer extends Component {

  private tableElement: HTMLElement;

  private richSheet: RichSheet;
  
  private workbench: IWorkBench;

  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    if (this.tableElement) {
      this.richSheet = new RichSheet({
        dom: this.tableElement
      });
      this.richSheet.load();
    }
  }

  public render() {
    return <div>
      <div></div>
      <div ref={(dom) => {
        this.tableElement = dom;
      }}></div>
    </div>;
  }
}
(function () {
  const root = document.getElementById('root');
  ReactDom.render(<TableContainer />, root);
})();
