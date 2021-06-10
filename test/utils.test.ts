import { getOrderByColName, getColNameByOrder } from '../src/utils/common';
describe('common工具方法测试', () => {
  it('通过单元格获取列序号', () => {
    expect(getOrderByColName('AA')).toEqual(27);
    expect(getOrderByColName('aa')).toEqual(27);
    expect(getOrderByColName('Ab')).toEqual(28);
  });
  it('通过序号获取单元格列名', () => {
    expect(getColNameByOrder(27)).toEqual('AA');
    expect(getColNameByOrder(28)).toEqual('AB');
  })
});