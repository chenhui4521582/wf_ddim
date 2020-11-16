import React, { useMemo } from 'react';
import { FormBase } from './components/form_base';
import { createForm } from 'rc-form';
import { Form } from 'antd';
import { InputItem, List } from 'antd-mobile';

const TextForm = (props: any) => {
  const data: any = [
    {
      baseControlType: 'text',
      isLocked: 0,
      isRequired: 1,
      name: '单行文本',
      id: 1,
      defaultValue: '人员招聘 陆晓世-2020-08-05',
    },
    {
      baseControlType: 'areatext',
      isLocked: 0,
      isRequired: 1,
      name: '多行文本',
      id: 2,
      defaultValue: '',
    },
    {
      baseControlType: 'number',
      isLocked: 0,
      isRequired: 1,
      name: '数字',
      id: 3,
      defaultValue: '',
    },
    {
      baseControlType: 'money',
      isLocked: 0,
      isRequired: 1,
      name: '金额',
      id: 4,
      defaultValue: '15.8',
    },
    {
      baseControlType: 'date',
      isLocked: 0,
      isRequired: 1,
      name: '日期',
      id: 5,
      defaultValue: '',
    },
    {
      baseControlType: 'datetime',
      isLocked: 0,
      isRequired: 1,
      name: '时间',
      id: 6,
      defaultValue: '',
    },
    {
      baseControlType: 'select',
      isLocked: 0,
      isRequired: 1,
      name: '单选框',
      id: 7,
      defaultValue: '',
      itemList: '协商离职|辞退|辞职',
    },
    {
      baseControlType: 'files',
      isLocked: 0,
      isRequired: 1,
      name: '文件',
      id: 9,
      defaultValue: '',
    },
    {
      baseControlType: 'remark',
      isLocked: 0,
      isRequired: 0,
      name: '说明文字',
      id: 10,
      defaultValue: '',
    },
    {
      baseControlType: 'user',
      isLocked: 0,
      isRequired: 1,
      name: '成员',
      id: 11,
      defaultValue: '',
    },
    {
      baseControlType: 'business',
      isLocked: 0,
      isRequired: 1,
      name: '一级业务线',
      id: 13,
      defaultValue: '',
    },
    {
      baseControlType: 'company',
      isLocked: 0,
      isRequired: 1,
      name: '劳动关系',
      id: 14,
      defaultValue: '',
    },
    {
      baseControlType: 'currUser',
      isLocked: 1,
      isRequired: 1,
      name: '当前成员',
      id: 15,
      defaultValue: '123123',
      defaultShowValue: '陆晓世',
    },
    {
      baseControlType: 'currDepartment',
      isLocked: 1,
      isRequired: 1,
      name: '当前部门',
      id: 16,
      defaultValue: 'kkn2dcluk4kfrbi4olzoadt6knrasb7y',
      defaultShowValue: '技术中台部',
    },
    {
      baseControlType: 'currBusiness',
      isLocked: 1,
      isRequired: 1,
      name: '当前业务线',
      id: 17,
      defaultValue: 'asd',
      defaultShowValue: '中台',
    },
    {
      baseControlType: 'currCompany',
      isLocked: 1,
      isRequired: 1,
      name: '当前公司',
      id: 18,
      defaultValue: 'asd1',
      defaultShowValue: '奖多多',
    },
    {
      baseControlType: 'position',
      isLocked: 0,
      isRequired: 1,
      name: '职位',
      id: 19,
      defaultValue: '',
      defaultShowValue: '',
    },
    {
      baseControlType: 'job',
      isLocked: 0,
      isRequired: 1,
      name: '岗位',
      id: 20,
      defaultValue: '',
      defaultShowValue: '',
    },
    {
      baseControlType: 'title',
      isLocked: 0,
      isRequired: 1,
      name: '标题',
      id: 21,
      defaultValue: '',
      defaultShowValue: '',
    },
    {
      baseControlType: 'formNumber',
      isLocked: 1,
      isRequired: 1,
      name: '单号',
      id: 22,
      defaultValue: '12321323',
      defaultShowValue: '',
    },
    {
      baseControlType: 'currDate',
      isLocked: 1,
      isRequired: 1,
      name: '当前日期',
      id: 23,
      defaultValue: '2020-08-06',
      defaultShowValue: '',
    },
    {
      baseControlType: 'currDatetime',
      isLocked: 1,
      isRequired: 1,
      name: '当前时间',
      id: 24,
      defaultValue: '2020-08-06 08:59:44',
      defaultShowValue: '',
    },
    {
      baseControlType: 'positionLevel',
      isLocked: 0,
      isRequired: 1,
      name: '职级',
      id: 25,
      defaultValue: '',
      defaultShowValue: '',
    },
    {
      baseControlType: 'currJobNumber',
      isLocked: 1,
      isRequired: 1,
      name: '当前工号',
      id: 26,
      defaultValue: 'JR100434',
      defaultShowValue: '',
    },
    {
      baseControlType: 'business2',
      isLocked: 0,
      isRequired: 1,
      name: '二级业务线',
      id: 27,
      defaultValue: '',
      defaultShowValue: '',
    },
    {
      baseControlType: 'currBusiness2',
      isLocked: 1,
      isRequired: 1,
      name: '当前二级业务线',
      id: 28,
      defaultValue: '12321',
      defaultShowValue: '集团中台',
    },
  ];
  // data.map((item: any) => {
  //   // if (item.baseControlType === 'currUser') {
  //   //   item.defaultTextValue = item.defaultShowValue;
  //   // } else {
  //   //   item.defaultTextValue = item.defaultValue;
  //   // }
  //   if (item.baseControlType === 'currDate') {
  //     const array = item.defaultValue.split('-');
  //     item.defaultValue = new Date(array[0], array[1], array[2]);
  //   }
  //   if (item.baseControlType === 'currDatetime') {
  //     const array = item.defaultValue.split('-');
  //     item.defaultValue = new Date(array[0], array[1], array[2], array[3], array[4]);
  //   }
  // })
  const { getFieldProps, getFieldError, getFieldDecorator } = props.form;
  const submit = () => {
    props.form.validateFields((error: any, value: any) => {
      console.log(error, value);
    });
  };
  return (
    <List style={{ padding: 10 }}>
      {data.map((item: any) => {
        return (
          <div key={item.id}>
            {getFieldDecorator(`${item.id}`, {
              rules: [{ required: item.isRequired === 1 }],
              initialValue: item.defaultShowValue || item.defaultValue,
            })(<FormBase data={item}></FormBase>)}
            <div style={{ color: 'red' }}>
              {getFieldError(`${item.id}`) && `${item.name}必填`}
            </div>
          </div>
        );
      })}
      {/* <button onClick={submit}>submit</button> */}
    </List>
  );
};

export default createForm()(TextForm);

// export default () => {
//   const data = [{
//     baseControlType: 'text',
//     isLocked: 0,
//     isRequired: 1,
//     name: '当前计划',
//     id: 1
//   }]
//   const [form] = Form.useForm();
//   const submit = (values: any) => {
//     debugger
//   }
//   const dataContent = useMemo(() => {
//     return data.map((item: any) => {
//       return (
//         <div>
//           <Form.Item
//             name={item.id}
//             rules={[{required: true, message: '必填'}]}
//           >
//             {/* <InputItem>aaaa</InputItem> */}
//             <FormBase {...item}></FormBase>
//           </Form.Item>
//           <div style={{color: 'red'}}>
//             {(form.getFieldError(item.id).length > 0 && 'aaaaa')}
//           </div>
//         </div>
//       )
//     })
//   }, [])
//   return (
//     <List>
//       <Form form={form} onFinish={submit}>
//         {
//           // data.map((item: any) => {
//           //   return (
//           //     <div>
//           //       <Form.Item
//           //         name={item.id}
//           //         rules={[{required: true, message: '必填'}]}
//           //       >
//           //         {/* <InputItem>aaaa</InputItem> */}
//           //         <FormBase {...item}></FormBase>
//           //       </Form.Item>
//           //       <div style={{color: 'red'}}>
//           //         {(form.getFieldError(item.id).length > 0 && 'aaaaa')}
//           //       </div>
//           //     </div>
//           //   )
//           // })
//           dataContent
//         }
//         <button onClick={submit}>submit</button>
//       </Form>
//     </List>
//   )
// }
