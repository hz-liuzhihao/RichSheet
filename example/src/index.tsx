import RichSheet from '../../src/index';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { IExcelBehavior } from '../../src/controllers/ToolBar';
import { createFromIconfontCN } from '@ant-design/icons';
import { Divider, Select, Tabs } from 'antd';
import { debounce } from 'lodash';
import 'antd/dist/antd.css';
import './index.css';

const TabPanel = Tabs.TabPane;

function CustomIcon(props) {
  const Wrapper = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2705379_g2wym70zwn6.js'
  });
  return <Wrapper {...props} onClick={() => {
    if (!props.disabled && typeof props.onClick == 'function') {
      props.onClick();
    }
  }} className="customicon" />
}

interface CustomButtonArgs {
  icon?: string;

  text?: string;

  orientation?: 'row' | 'column';

  width?: number;

  height?: number;

  disabled?: boolean;

  iconSize?: number;

  style?: any;
}

function CustomButton(props: CustomButtonArgs) {
  const { icon, text, orientation, width, height, disabled = false, iconSize, style = {} } = props;
  return <div className="custom_btn" style={{ display: 'flex', flexDirection: orientation, width: `${width}px`, height: `${height}px`, ...style }}>
    <CustomIcon type={icon} disabled={disabled} style={{ fontSize: `${iconSize}px` }} />
    {text && <span>{text}</span>}
  </div>
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
        dom: this.tableElement,
        // excel: JSON.parse('{"sheets":[{"cells":[{"row":0,"col":8,"rowSpan":6,"colSpan":4},{"row":9,"col":2,"rowSpan":8,"colSpan":5}],"rows":[{},{},{},{},{},{},{},{},{},{"height":160},{},{},{},{},{},{},{},{},{},{}],"cols":[{},{},{},{},{"width":227},{},{},{},{"width":258},{},{},{},{},{},{},{},{},{},{},{}]}]}')
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

  public renderStartMenu() {
    return <div className="start_menu_container">
      <div>
        <CustomButton text="粘贴" icon="icon-paste" iconSize={24} orientation='column' width={60} height={60} />
        <div className="btn_height">
          <CustomButton text="剪切" icon="icon-cut" iconSize={16} orientation="row" width={70} height={30} />
          <CustomButton text="复制" icon="icon-fuzhi" iconSize={18} orientation="row" width={70} height={30} />
        </div>
        <CustomButton text="格式刷" icon="icon-zu" iconSize={24} orientation="column" width={60} height={60} />
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <div className="btn_height">
          <div className="flex_row">
            <Select placeholder="选择字体" />
            <Select placeholder="选择字体大小" />
            <CustomButton icon="icon-Word-add" style={{marginLeft: '5px'}} iconSize={24} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-Word-minus" iconSize={24} orientation="row" width={35} height={30} />
          </div>
          <div className="flex_row">

          </div>
        </div>
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>

      </div>
      <Divider type='vertical' className="app_divider" />
      <div>

      </div>
      <Divider type='vertical' className="app_divider" />
      <div>

      </div>
      <Divider type='vertical' className="app_divider" />
      <div>

      </div>
      <Divider type='vertical' className="app_divider" />
      <div>

      </div>
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
            {this.renderStartMenu()}
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
