import React from 'react';
import { InputItem, TextareaItem, DatePicker, List } from 'antd-mobile';
import SelectTemplate from './select_template';
import { Upload, Button } from 'antd';
import MultiplePicker from './multiplePicker';

const Item = List.Item;
export const FormContent = (props: any, ref: any) => {
  const { data, onChange, value, setFieldsValue } = props;
  const { baseControlType, isLocked, name, isRequired } = data;
  const newProps = {
    onChange,
    value,
    disabled: isLocked === 1,
    setFieldsValue,
    username: data.userName,
    formnameid: data.formnameid,
  };
  switch (baseControlType) {
    // 单行文本
    case 'text':
    case 'formNumber':
    case 'currJobNumber':
    case 'totalVacationTime':
    case 'totalReVacationTime':
    case 'overTimeTotal':
    case 'remainCardNumber':
    case 'vacationTime':
    case 'outCheckTime':
      return (
        <InputItem {...newProps} style={{ textAlign: 'right' }}>
          {name}
          {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
        </InputItem>
      );
    case 'title':
      return (
        <TextareaItem
          title={
            <div>
              {name}
              {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
            </div>
          }
          {...newProps}
          rows={2}
        ></TextareaItem>
      );
    // 多行文本
    case 'areatext':
    case 'remark':
    case 'title':
      return (
        <List className="text-list">
          <Item>{name}</Item>
          <TextareaItem {...newProps} rows={2} placeholder={`请输入${name}`} />
        </List>
      );
    // 数字
    case 'number':
      return (
        <InputItem type="number" {...newProps} style={{ textAlign: 'right' }}>
          {name}
          {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
        </InputItem>
      );
    // 金额
    case 'money':
      return (
        <InputItem type="money" {...newProps}>
          {name}
          {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
        </InputItem>
      );
    // 日期
    case 'date':
      return (
        <DatePicker mode="date" {...newProps}>
          <List.Item arrow="horizontal">
            <span style={{ color: newProps.disabled ? '#bbb' : '#000' }}>
              {name}
            </span>
            {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
          </List.Item>
        </DatePicker>
      );
    // 时间
    case 'datetime':
    case 'vacationStartTime':
    case 'vacationEndTime':
    case 'overTimeStart':
    case 'overTimeEnd':
    case 'outCheckStartTime':
    case 'outCheckEndTime':
      return (
        <DatePicker {...newProps}>
          <List.Item arrow="horizontal">
            <span style={{ color: newProps.disabled ? '#bbb' : '#000' }}>
              {name}
            </span>
            {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
          </List.Item>
        </DatePicker>
      );
    // 单选框
    case 'user':
    case 'select':
    case 'business':
    case 'position':
    case 'job':
    case 'positionLevel':
    case 'business2':
    case 'depGroup':
    case 'cost':
    case 'labor':
    case 'group':
    case 'positionMLevel':
    case 'wkTask':
    case 'LevelTemplate':
    case 'LevelMTemplate':
    case 'vacationType':
    case 'addSignType':
      return (
        <SelectTemplate
          newProps={newProps}
          data={data}
          type={baseControlType}
        ></SelectTemplate>
      );
    // case 'user':
    case 'currUser':
    case 'currBusiness':
    case 'currBusiness2':
    case 'currDate':
    case 'currDatetime':
    case 'currDepartment':
    case 'currCompany':
      return (
        <InputItem {...newProps} style={{ textAlign: 'right' }}>
          {name}
          {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
        </InputItem>
      );
    case 'currDepGroup':
    case 'currGroup':
      return <TextareaItem title={name} {...newProps} rows={2}></TextareaItem>;
    // 多选框
    case 'multiple':
      return (
        <MultiplePicker
          newProps={newProps}
          type={baseControlType}
          data={data}
        ></MultiplePicker>
      );
    // 附件
    case 'files':
      return (
        <div>
          <List>
            <List.Item
              extra={
                <Upload action="/api/transmit/upload/saveFile" {...newProps}>
                  <Button>上传</Button>
                </Upload>
              }
            >
              <span style={{ color: newProps.disabled ? '#bbb' : '#000' }}>
                {name}
              </span>
              {isRequired === 1 && <span style={{ color: 'red' }}>*</span>}
            </List.Item>
          </List>
        </div>
      );
    default:
      return <></>;
  }
};

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toLowerCase() + s.slice(1);
};

export const FormBase = React.forwardRef(FormContent);
