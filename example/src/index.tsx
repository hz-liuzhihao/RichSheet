import RichSheet from '../../src/index';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { IExcelBehavior } from '../../src/controllers/ToolBar';
import { createFromIconfontCN } from '@ant-design/icons';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import 'antd/dist/antd.css';
import './index.css';

const TabPanel = Tabs.TabPane;

function CustomIcon(props) {
  const Wrapper = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2705379_l89i2n8h2os.js'
  });
  return <Wrapper {...props} onClick={() => {
    if (!props.disabled && typeof props.onClick == 'function') {
      props.onClick();
    }
  }} className="customicon" />
}
class TableContainer extends Component<JSONObject, {
  workbench?: IExcelBehavior
}> {

  private tableElement: HTMLElement;

  private richSheet: RichSheet;

  private isSetState: boolean;

  public constructor(props) {
    super(props);
    this.state = {
    };
  }

  public componentDidMount() {
    if (this.tableElement) {
      this.richSheet = new RichSheet({
        dom: this.tableElement
      });
      this.richSheet.load();
      const workbench = this.richSheet.getWorkbench();
      workbench.addBahaviorChangeListener(() => {
        this.forceUpdate()
      });
      this.setState({
        workbench
      });
    }
  }

  public renderBasicOperate() {
    const { workbench } = this.state;
    return <div style={{ padding: '0 20px' }}>
      <CustomIcon type="icon-undo" disabled={!workbench.canUndo()} onClick={() => workbench.undo()} />
      <CustomIcon type="icon-save" disabled={!workbench.canSave()} onClick={() => workbench.save()} />
      <CustomIcon type="icon-redo" disabled={!workbench.canRedo()} onClick={() => workbench.redo()} />
    </div>;
  }

  public render() {
    const { workbench } = this.state;
    return <div className="main_container">
      {workbench && <div className="toolbar_container">
        <Tabs defaultActiveKey="1" tabBarExtraContent={{
          "left": this.renderBasicOperate()
        }} style={{ width: '100%' }}>
          <TabPanel tab="开始" key="1">
            开始菜单
          </TabPanel>
          <TabPanel tab="插入" key="2">
            插入菜单
          </TabPanel>
          <TabPanel tab="页面布局" key="3">
            页面布局
          </TabPanel>
          <TabPanel tab="公式" key="4">
            公式
          </TabPanel>
          <TabPanel tab="数据" key="5">
            数据
          </TabPanel>
          <TabPanel tab="审阅" key="6">
            审阅
          </TabPanel>
          <TabPanel tab="视图" key="7">
            视图
          </TabPanel>
          <TabPanel tab="工具" key="8">
            工具
          </TabPanel>
        </Tabs>
      </div>}
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
