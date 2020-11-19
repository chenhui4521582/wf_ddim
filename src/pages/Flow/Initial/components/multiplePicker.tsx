import React, { useState } from 'react';
import { List, Menu } from 'antd-mobile';

interface ISelectParams {
  data: any;
  newProps: any;
  type: string;
}

interface IPickerData {
  value: string;
  label: string;
}

export default (props: ISelectParams) => {
  const [visible, setVisible] = useState<boolean>(false);
  const {
    data: { itemList, name, isRequired },
    newProps,
  } = props;
  const [showValue, setShowValue] = useState<string>(newProps.value);
  let dataSource: IPickerData[] = [];
  if (Object.prototype.toString.call(itemList) === '[object String]') {
    itemList?.split('|').map((item: any) => {
      dataSource.push({ value: item, label: item });
    });
  }

  const showMenu = () => {
    if (newProps.disabled) {
      return;
    } else {
      setVisible(true);
    }
  };

  const onOk = (value: any) => {
    setShowValue(value.join(','));
    let params: any = {};
    params[newProps.formnameid] = value.join(',');
    newProps.setFieldsValue(params);
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <List>
        <List.Item
          multipleLine
          wrap
          extra={
            <div onClick={showMenu}>{showValue ? showValue : '请选择'}</div>
          }
        >
          <span style={{ color: newProps.disabled ? '#bbb' : '#000' }}>
            {name}
          </span>
          {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
        </List.Item>
      </List>
      {visible && (
        <Menu
          style={{
            position: 'fixed',
            zIndex: 70,
            width: '100%',
            bottom: 0,
            left: 0,
          }}
          data={dataSource}
          level={1}
          value={showValue ? showValue.split(',') : []}
          onOk={onOk}
          onCancel={onCancel}
          height={document.documentElement.clientHeight * 0.6}
          multiSelect
        />
      )}
    </div>
  );
};
