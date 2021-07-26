import RichSheet from '../../src/index';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { IExcelBehavior } from '../../src/controllers/ToolBar';
import {RedoOutlined, UndoOutlined, SaveOutlined} from '@ant-design/icons';
import './index.css';
class TableContainer extends Component {

  private tableElement: HTMLElement;

  private richSheet: RichSheet;

  private workbench: IExcelBehavior;

  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    if (this.tableElement) {
      this.richSheet = new RichSheet({
        dom: this.tableElement
      });
      this.richSheet.load();
      this.workbench = this.richSheet.getWorkbench();
    }
  }

  public render() {
    return <div className="main_container">
      <div className="toolbar_container">
        <SaveOutlined />
        <UndoOutlined />
        <RedoOutlined />
      </div>
      <div className="express_container"></div>
      <div className="richsheet" ref={(dom) => {
        this.tableElement = dom;
      }}></div>
    </div>;
  }
}


(function () {
  const root = document.getElementById('root');
  ReactDom.render(<TableContainer />, root);
})();
