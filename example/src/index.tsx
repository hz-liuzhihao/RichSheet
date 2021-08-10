import RichSheet from '../../src/index';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { IExcelBehavior } from '../../src/controllers/ToolBar';
import { createFromIconfontCN, DownOutlined } from '@ant-design/icons';
import { Divider, Select, Tabs } from 'antd';
import { SketchPicker, RGBColor } from 'react-color';
import 'antd/dist/antd.css';
import './index.css';
import DropdownButton from '_antd@4.16.8@antd/lib/dropdown/dropdown-button';

const TabPanel = Tabs.TabPane;

const AppIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2705379_oczjmx69q4c.js'
});

function CustomIcon(props) {
  return <AppIcon {...props} onClick={() => {
    if (!props.disabled && typeof props.onClick == 'function') {
      props.onClick();
    }
  }} className="customicon" />
}

const FontFamilyOption = [{
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif'
}, {
  label: 'Arial Black',
  value: "'Arial Black', Gadget, sans-serif"
}, {
  label: 'Arial Narrow',
  value: "'Arial Narrow', sans-serif"
}, {
  label: 'Verdana',
  value: 'Verdana, Geneva, sans-serif'
}, {
  label: 'Georgia',
  value: 'Georgia, serif'
}, {
  label: 'Times New Roman',
  value: "'Times New Roman', Times, serif"
}, {
  label: 'Trebuchet MS',
  value: "'Trebuchet MS', Helvetica, sans-serif"
}, {
  label: 'Courier New',
  value: "'Courier New', Courier, monospace"
}, {
  label: 'Impact',
  value: "Impact, Charcoal, sans-serif"
}, {
  label: 'Comic Sans MS',
  value: "'Comic Sans MS', cursive"
}, {
  label: 'Tahoma',
  value: 'Tahoma, Geneva, sans-serif'
}, {
  label: 'Courier',
  value: 'Courier, monospace'
}, {
  label: 'Lucida Sans Unicode',
  value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"
}, {
  label: 'Lucida Console',
  value: "'Lucida Console', Monaco, monospace"
}, {
  label: 'Garamond',
  value: "Garamond, serif"
}, {
  label: 'MS Sans Serif',
  value: "'MS Sans Serif', Geneva, sans-serif"
}, {
  label: 'MS Serif',
  value: "'MS Serif', 'New York', sans-serif"
}, {
  label: 'Palatino Linotype',
  value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif"
}, {
  label: 'Symbol',
  value: "Symbol, sans-serif"
}, {
  label: 'Bookman Old Style',
  value: "'Bookman Old Style', serif"
}];

const FontSizeOption = [{
  label: '12',
  value: 12
}, {
  label: '14',
  value: 14
}, {
  label: '16',
  value: 16
}, {
  label: '18',
  value: 18
}, {
  label: '20',
  value: 20
}, {
  label: '22',
  value: 22
}, {
  label: '24',
  value: 24
}, {
  label: '26',
  value: 26
}, {
  label: '28',
  value: 28
}, {
  label: '30',
  value: 30
}, {
  label: '32',
  value: 32
}, {
  label: '34',
  value: 34
}, {
  label: '36',
  value: 36
}, {
  label: '38',
  value: 38
}, {
  label: '40',
  value: 40
}, {
  label: '42',
  value: 42
}, {
  label: '44',
  value: 44
}]

interface CustomButtonArgs {
  icon?: string;

  text?: string;

  orientation?: 'row' | 'column';

  width?: number;

  height?: number;

  disabled?: boolean;

  iconSize?: number;

  style?: any;

  isActive?: boolean;

  onClick?: () => void;
}

function CustomButton(props: CustomButtonArgs) {
  const { icon, text, orientation, width, height, disabled = false, isActive, iconSize, style = {}, onClick } = props;
  return <div className={`custom_btn ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`} onClick={onClick} style={{ display: 'flex', flexDirection: orientation, width: `${width}px`, height: `${height}px`, ...style }}>
    <CustomIcon type={icon} disabled={disabled} style={{ fontSize: `${iconSize}px` }} />
    {text && <span>{text}</span>}
  </div>
}

function getRgba(rgb: RGBColor) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}

class TableContainer extends Component<JSONObject, {
  workbench?: IExcelBehavior,
  color: RGBColor,
  bgColor: RGBColor,
}> {

  private tableElement: HTMLElement;

  private richSheet: RichSheet;

  private isSetState: boolean;

  public constructor(props) {
    super(props);
    this.state = {
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      bgColor: {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }
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
    const { workbench, color, bgColor } = this.state;
    const styleMap = workbench.getCurrentStyleMap() || {};
    const { fontWeight = [], fontStyle = [], underline = [], lineThrough = [], overline = [], fontFamily = [], fontSize = [], textAlign = [], verticalAlign = [], whiteSpace = [], textIndent = [] } = styleMap;
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
            <Select placeholder="选择字体" value={fontFamily.length == 1 && fontFamily[0] != 'null' ? fontFamily[0] : null} style={{ width: '200px' }} options={FontFamilyOption} size='small' onChange={(value: string) => {
              workbench.setFontFamily(value);
            }} />
            <Select placeholder="选择字体大小" value={fontSize.length == 1 && fontSize[0] != 'null' ? fontSize[0] : null} style={{ width: '138px' }} options={FontSizeOption} size='small' onChange={(value: number) => {
              workbench.setFontSize(value);
            }} />
            <CustomButton icon="icon-Word-minus" disabled={fontSize.length > 1 || fontSize[0] == 'null' || fontSize[0] <= 12} onClick={() => {
              if (fontSize.length > 1 || fontSize[0] == 'null' || fontSize[0] <= 12) {
                return;
              }
              workbench.setFontSize(fontSize[0] - 2);
            }} iconSize={24} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-Word-add" disabled={fontSize.length > 1} onClick={() => {
              if (fontSize.length > 1) {
                return;
              }
              let resultFontSize = fontSize[0] == 'null' ? 12 : fontSize[0] || 12
              workbench.setFontSize(resultFontSize + 2);
            }} iconSize={24} orientation="row" width={35} height={30} />
          </div>
          <div className="flex_row">
            <CustomButton icon="icon-zitijiacu" disabled={fontWeight.length > 1} isActive={fontWeight.length == 1 && fontWeight[0] == 600} onClick={() => {
              if (fontWeight.length == 1 && fontWeight[0] == 600) {
                workbench.setFontWeight(null);
              } else {
                workbench.setFontWeight(600);
              }
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-xieti" disabled={fontStyle.length > 1} isActive={fontStyle.length == 1 && fontStyle[0] == 'italic'} onClick={() => {
              if (fontStyle.length == 1 && fontStyle[0] == 'italic') {
                workbench.setFontStyle(null);
              } else {
                workbench.setFontStyle('italic');
              }
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-ziyuan" disabled={underline.length > 1} isActive={underline.length == 1 && underline[0] == 'underline'} onClick={() => {
              if (underline.length == 1 && underline[0] == 'underline') {
                workbench.setUnderline(null);
              } else {
                workbench.setUnderline('underline');
              }
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-shanchuxian" disabled={lineThrough.length > 1} isActive={lineThrough.length == 1 && lineThrough[0] == 'line-through'} onClick={() => {
              if (lineThrough.length == 1 && lineThrough[0] == 'line-through') {
                workbench.setLineThrough(null);
              } else {
                workbench.setLineThrough('line-through');
              }
            }} iconSize={25} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-zhidingxian" disabled={overline.length > 1} isActive={overline.length == 1 && overline[0] == 'overline'} onClick={() => {
              if (overline.length == 1 && overline[0] == 'overline') {
                workbench.setOverline(null);
              } else {
                workbench.setOverline('overline');
              }
            }} iconSize={18} orientation="row" width={35} height={30} />
            <DropdownButton className="custom_drop" overlay={<SketchPicker width="300px" color={bgColor} onChangeComplete={(color) => {
              this.setState({
                bgColor: color.rgb
              });
              workbench.setBackgroundColor(getRgba(color.rgb));
            }} />} icon={<DownOutlined />}>
              <div className="flex_column" onClick={() => {
                const { bgColor } = this.state;
                workbench.setBackgroundColor(getRgba(bgColor));
              }}>
                <AppIcon type="icon-beijingyanse" style={{ fontSize: '18px', padding: 0 }} className="customicon" />
                <div className="bg_color" style={{ backgroundColor: getRgba(bgColor) }}></div>
              </div>
            </DropdownButton>
            <DropdownButton className="custom_drop" overlay={<SketchPicker width="300px" color={color} onChangeComplete={(color) => {
              this.setState({
                color: color.rgb
              });
              workbench.setColor(getRgba(color.rgb));
            }} />} icon={<DownOutlined />}>
              <div className="flex_column" onClick={() => {
                const { color } = this.state;
                workbench.setColor(getRgba(color));
              }}>
                <AppIcon type="icon-Font-color" style={{ fontSize: '18px', padding: 0 }} className="customicon" />
                <div className="font_color" style={{ backgroundColor: getRgba(color) }}></div>
              </div>
            </DropdownButton>
            <CustomButton icon="icon-jurassic_insert-line" iconSize={15} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-jurassic_insert-column" iconSize={15} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-jurassic_delete-line" iconSize={15} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-jurassic_delete-column" iconSize={15} orientation="row" width={35} height={30} />
          </div>
        </div>
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <div className="btn_height">
          <div className="flex_row">
            <CustomButton icon="icon-chuizhidingduiqi" isActive={verticalAlign.length == 1 && verticalAlign[0] == 'flex-start'} onClick={() => {
              workbench.setVerticalAlign('flex-start');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-chuizhijuzhongduiqi" isActive={verticalAlign.length == 1 && verticalAlign[0] == 'center'} onClick={() => {
              workbench.setVerticalAlign('center');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-chuizhididuiqi" isActive={verticalAlign.length == 1 && verticalAlign[0] == 'flex-end'} onClick={() => {
              workbench.setVerticalAlign('flex-end');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-suojinindent3" disabled={textIndent.length > 1} onClick={() => {
              if (textIndent.length > 1) {
                return;
              }
              let resultTextIndent = textIndent[0] == 'null' ? 14 : textIndent[0] || 14
              workbench.setTextIndent(resultTextIndent + 2);
            }} iconSize={22} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-suojin" disabled={textIndent.length > 1 || textIndent[0] == 'null' || textIndent[0] <= 0} onClick={() => {
              if (textIndent.length > 1 || textIndent[0] == 'null' || textIndent[0] <= 0) {
                return;
              }
              workbench.setTextIndent(textIndent[0] - 2);
            }} iconSize={22} orientation="row" width={35} height={30} />
          </div>
          <div className="flex_row">
            <CustomButton icon="icon-shuipingzuoduiqi" isActive={textAlign.length == 1 && textAlign[0] == 'left'} onClick={() => {
              workbench.setTextAlign('left');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-shuipingjuzhongduiqi" isActive={textAlign.length == 1 && textAlign[0] == 'center'} onClick={() => {
              workbench.setTextAlign('center');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-shuipingyouduiqi" isActive={textAlign.length == 1 && textAlign[0] == 'right'} onClick={() => {
              workbench.setTextAlign('right');
            }} iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-liangduanduiqi" isActive={textAlign.length == 1 && textAlign[0] == 'justify'} onClick={() => {
              workbench.setTextAlign('justify');
            }} iconSize={22} orientation="row" width={35} height={30} />
          </div>
        </div>
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <CustomButton text="合并居中" icon="icon-hebinghoujuzhong" onClick={() => workbench.mergeCell()} iconSize={24} orientation='column' width={80} height={60} />
        <CustomButton text="自动换行" icon="icon-jurassic_word-wrap" disabled={whiteSpace.length > 1} isActive={whiteSpace.length == 1 && whiteSpace[0] == 'normal'} onClick={() => {
          if (whiteSpace.length == 1 && whiteSpace[0] == 'normal') {
            workbench.setWhiteSpace('nowrap');
          } else {
            workbench.setWhiteSpace('normal');
          }
        }} iconSize={24} orientation='column' width={80} height={60} />
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <div className="btn_height">
          <div className="flex_row">
            <Select placeholder="选择显示格式" size='small' />
          </div>
          <div className="flex_row" style={{ marginTop: '5px' }}>
            <CustomButton icon="icon-shuzihuobi" iconSize={18} orientation="row" width={35} height={30} />
            <CustomButton icon="icon-baifenhao" iconSize={18} orientation="row" width={35} height={30} />
          </div>
        </div>
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <CustomButton text="条件格式" icon="icon-biaoge" iconSize={24} orientation='column' width={80} height={60} />
        <CustomButton text="表格样式" icon="icon-biaoge" iconSize={24} orientation='column' width={80} height={60} />
      </div>
      <Divider type='vertical' className="app_divider" />
      <div>
        <CustomButton text="符号" icon="icon-paste" iconSize={24} orientation='column' width={60} height={60} />
        <CustomButton text="求和" icon="icon-qiuhe" iconSize={24} orientation='column' width={60} height={60} />
        <CustomButton text="筛选" icon="icon-shaixuan" iconSize={24} orientation='column' width={60} height={60} />
        <CustomButton text="排序" icon="icon-paixu" iconSize={24} orientation='column' width={60} height={60} />
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
