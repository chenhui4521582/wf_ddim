import React, { useEffect, useState } from 'react';
import { 
  queryDetail,
  IFormDetail,
  saveFlow,
  queryRule,
  IFlowStep, 
  ICurrentControl, 
  queryTotalVacationTime, 
  IVacationTime, 
  IOverTimeParams,
  IOverTimeRes, 
  queryTotalOvertime,
  IRemainCardNumberRes,
  queryRemainCardNumber,
  IOutcheckTimeParams,
  IOutcheckTimeRes,
  queryTotalOutcheckTime,
  IAvailableTimeRes,
  queryAvailableTime
} from './services/detail';
import { GlobalResParams } from '@/utils/global';
import { getUnitType } from '@/services/global';
import { useModel, history, Switch } from 'umi';
import { WingBlank, SegmentedControl, WhiteSpace, Card, List, Button, Toast } from 'antd-mobile';
import { FormBase } from './components/form_base';
import shu from '@/assets/shu.png';
import StepFlow from '@/pages/Flow/components/StepFlow';
import { toFormData } from './components/form_function';
import { Form } from 'antd';
import moment from 'moment';
import { appCall } from '@/utils/bridge.js';

const validateMessages = {
  required: "'${name}' 是必填字段",
};

interface IUnitList {
  code: number;
  desc: string;
}

export default (props: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<IFormDetail>();
  const [userCode, setUserCode] = useState<String>();
  const { setBarName } = useModel('useBarName');
  const id = Number(props.match.params.id);
  const [selected, setSelected] = useState(0);
  const [resApprovalId, setResApprovalId] = useState(-1);
  const [flowSteps, setFlowSteps] = useState<IFlowStep[]>([]);
  const [unitList, steUnitList] = useState<IUnitList[]>();
  const [controlList, setControlList] = useState<any[]>([]);
  let _currentControl = {} as ICurrentControl;
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<IFormDetail> = await queryDetail(id);
      let json1: GlobalResParams<IUnitList[]> = await getUnitType();
      let list: any[] = []
      if (json1.status === 200) {
        steUnitList(json1?.obj);
      }
      res?.obj?.formChildlist.map(item => {
        if (item.type === 1) {
          item.canAdd = true
        }
        item.multipleNumber = 1;
        item?.controlList?.map(innerItem => {
          list.push(innerItem)
        })
      });

      /** 获取用户userCode **/
      let userItem = list?.find(list => {
        return list.baseControlType === 'currUser';
      })
      const userCode = userItem?.defaultValue || '';

      /** 动态设置当前剩余补卡次数 **/
      let remainCardNumberItem  = list?.find(list => {
        return list.baseControlType === 'remainCardNumber';
      })
      remainCardNumberItem && userCode && _queryRemainCardNumber(remainCardNumberItem, userCode);

      /** 动态设置当前可休年假天数 **/
      let vacationTimeItem  = list?.find(list => {
        return list.baseControlType === 'vacationTime';
      })
      vacationTimeItem && userCode && _queryAvailableTime(vacationTimeItem, userCode);

      setDetail(res?.obj);
      setBarName(res?.obj?.name);
      setResApprovalId(res?.obj?.resApprovalId);
      setControlList(list);
      setUserCode(userCode);
    }
    getDetail();
  }, []);

  useEffect(() => {
    async function getRule() {
      let res: GlobalResParams<IFlowStep[]> = await queryRule(resApprovalId);
      setFlowSteps(res?.obj);
    }
    if (resApprovalId !== -1) {
      getRule();
    }
  }, [resApprovalId]);

  const changeMenu = (e: any) => {
    setSelected(e.nativeEvent.selectedSegmentIndex);
  }

  const handleAdd = (childList: any) => {
    let newList = {...childList};
    let newformChildlist: any[] = [...detail?.formChildlist as any]
    let newListIndex: any = 0
    detail?.formChildlist.map((item, index: Number) => {
      if(item.id === newList.id) {
        item.canAdd = false;
        newListIndex = index;
      }
    })
    newList.canRemove = true;
    newList.canAdd = true;
    newList.sort = newList.sort + 10000;
    newformChildlist.splice(newListIndex + 1, 0, newList)
    let data;
    detail && (data = {
      ...detail,
      formChildlist: [...newformChildlist]
    })
    setDetail(data as any);
  }

  const handleRemove = (childList: any) => {
    const newList: any = detail?.formChildlist.filter(item => item.sort !== childList.sort);
    const addList = newList.filter((item: any) => (item.canAdd === true && item.id === childList.id));
    addList.length === 0 && newList.map((item: any) => {
      if (item.id === childList.id && item.sort === childList.sort - 10000) {
        item.canAdd = true;
      }
    })
    let data;
    detail && (data = {
      ...detail,
      formChildlist: [
        ...newList,
      ]
    })
    setDetail(data as any);
  }

  const countInArray = (array: number[], what: number) => {
    return array.filter(item => item == what).length;
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    let formData: any[] = [];
    let filesData: any[] = [];
    Object.keys(values).map(item => {
      let formDataItem:any = toFormData(item, values[item], 'id', unitList);
      /** 文件控件需要特殊字段传递，这里把文件控件的值制空**/
      if(formDataItem.type === 'files') {
        filesData = formDataItem?.value;
        formData.push({
          "id": formDataItem.id,
          "multipleNumber": 1,
          "showValue": "",
          "value": ""
        });
        return
      }
      formDataItem && formData.push(formDataItem);
    });
    let idArray: number[] = [];
    formData.map(item => {
      let count = countInArray(idArray, item.id);
      if (count > 0) {
        item.multipleNumber = item.multipleNumber + count;
      }
      idArray.push(item.id);
    })

    let res: GlobalResParams<string> = await saveFlow({
      resFormId: id,
      wfResFormSaveItemCrudParamList: formData,
      wfTaskFormFilesCrudParamList: filesData
    });
    setLoading(false);
    if (res.status === 200) {
      history.goBack();
      Toast.success(res.msg, 2);
      appCall.callIOSHandler('ddimFinishCallBack', {}, function(response: any) {
      });
    }
  }

  const handleError = ({errorFields}: any) => {
    let messages = errorFields[0].errors[0].split("'")[1].split('-$-')[5] + errorFields[0].errors[0].split("'")[2];
    Toast.fail(messages, 2);
  }

  /** 获取当月剩余补卡次数 **/
  async function _queryRemainCardNumber(item: any, userCode: String) {
    let res: GlobalResParams<IRemainCardNumberRes> = await queryRemainCardNumber(userCode);
    if(res.status === 200) {
      let { surplus } = res?.obj; 
      let params:any = {} 
      params[item.formnameid] = surplus + "次"
      form.setFieldsValue(params);
    } 
  }

  /** 获取可休年假天数 **/
  async function _queryAvailableTime(item: any, userCode: String) {
    let res: GlobalResParams<IAvailableTimeRes> = await queryAvailableTime(userCode);
    if(res.status === 200) {
      let { currentLeft } = res?.obj; 
      let params:any = {} 
      params[item.formnameid] = currentLeft + "天"
      form.setFieldsValue(params);
    } 
  }

  /** 
   * 当表单内控件的值发送变化的时候的回调
   * @params
   *  changedValues 发生变化的控件返回值
   *  allValues  全部控件的返回值
  **/
  const onValuesChange = (changedValues: any[], allValues: any) => {
    /** 当前发生改变的控件的key **/ 
    const currentControlKey: any = Object.keys(changedValues)[0];
    /** 当前发生改变的控件名称 **/
    const currentControlName: String = currentControlKey && currentControlKey.split('-$-')[1];
    /** 当前发生改变的控件的value **/
    const currentControlValue: any = changedValues[currentControlKey];
    /** 判断当前页面是否有请假,销假控件 **/
    controlList.map((item: any) => {
      switch (item.baseControlType) {
        /** 请假控件 **/
        case 'totalVacationTime': 
          _currentControl.type = 1;
          _currentControl.apiType = 1;
          _currentControl.name = item.formnameid;
          break;
        /** 销假控件 **/
        case 'totalReVacationTime': 
          _currentControl.type = 2;
          _currentControl.apiType = 1;
          _currentControl.name = item.formnameid;
          break;
        /** 加班控件 **/
        case 'overTimeTotal':
          _currentControl.apiType = 2;
          _currentControl.name = item.formnameid;
          break;
        /** 外出, 出差控件 **/
        case 'outCheckTime':
          _currentControl.apiType = 3;
          _currentControl.name = item.formnameid;
          break;
      }
    })
    switch (currentControlName) {
      /** 判断当前控件是不是请假,销假时间控件 **/
      /** 判断当前控件是不是加班时间控件 **/
      case 'vacationStartTime':
      case 'overTimeStart':
      case 'outCheckStartTime':
        _currentControl.lock = false
        _currentControl.startTime  = moment(currentControlValue).format('YYYY-MM-DD HH:mm:ss');
        break;
      /** 判断当前控件是不是请假,销假时间控件 **/
      /** 判断当前控件是不是加班时间控件 **/
      case 'vacationEndTime':
      case 'overTimeEnd':
      case 'outCheckEndTime':
        let endTime = moment(currentControlValue).format('YYYY-MM-DD HH:mm:ss');
        if(!_currentControl.startTime 
          ||
          new Date(_currentControl.startTime).getTime() >= new Date(endTime).getTime()
        ) {
          Toast.fail('开始时间需小于结束时间', 2);
          const key = Object.keys(changedValues)[0];
          allValues[key] = null
          form.setFieldsValue(allValues);
          return
        } 
        _currentControl.lock = false
        _currentControl.endTime = endTime;
        break;
      case 'vacationType':
        _currentControl.typeId = currentControlValue[0]?.split('---')[0] || 1;
        break;   
    }
    /** 根据apiType 类型,重新拼装参数并且调取接口 **/
    const { endTime, startTime, type, typeId, apiType, lock = false} = _currentControl;
    if (apiType === 1 && endTime && startTime && type && typeId && userCode && !lock) {
      _queryTotalVacationTime({endTime, startTime, type, typeId: ~~typeId, userCode});
    } else if (apiType === 2 && endTime && startTime && !lock) {
      _queryTotalOvertime({overTimeEnd: endTime, overTimeStart: startTime});
    } else if (apiType === 3 && endTime && startTime && !lock) {
      _queryTotalOutcheckTime({outcheckTimeEnd: endTime, outcheckTimeStart: startTime})
    }

    /** 请求接口获取请假,销假总时长 **/
    async function _queryTotalVacationTime (params: any) {
      let res: GlobalResParams<IVacationTime> = await queryTotalVacationTime(params);
      if(res.status === 200) {
        let {unit, time, isTrue, reason} = res?.obj;  
        if(!isTrue) {
          Toast.fail(reason, 2);
          return
        }
        form.setFieldsValue(_updateFieldsValue(time, unit));
      }   
    }
    /** 请求接口获取请假,销假总时长 **/
    async function _queryTotalOvertime (params: IOverTimeParams) {
      let res: GlobalResParams<IOverTimeRes> = await queryTotalOvertime(params);
      if(res.status === 200) {
        let { hour } = res?.obj;  
        form.setFieldsValue(_updateFieldsValue(hour, 0));
      }   
    }
    /** 请求接口获取外出,出差总时长 **/
    async function _queryTotalOutcheckTime (params: IOutcheckTimeParams) {
      let res: GlobalResParams<IOutcheckTimeRes> = await queryTotalOutcheckTime(params);
      if(res.status === 200) {
        let { hour } = res?.obj;  
        form.setFieldsValue(_updateFieldsValue(hour, 0));
      }   
    }
    const _updateFieldsValue = (time: Number, unit: Number): any => {
      const { name } = _currentControl;
      let allControl = allValues;
      allControl[ name as any ] = `${time}${unit == 1 ? '天' : '小时'}`
      _currentControl.lock = true
      return allControl
    }
  }

  return (
    <div>
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <SegmentedControl
          values={['流程表单', '审批规则']}
          tintColor={'#338CDF'}
          style={{height: 30}}
          onChange={changeMenu}
        />
        <WhiteSpace size="lg" />
        {
          selected === 0 ?
          <Form form={form} onFinish={handleSubmit} onFinishFailed={handleError} validateMessages={validateMessages} onValuesChange={onValuesChange}>
            {
              detail?.formChildlist?.map(item => {
                return (
                  <div key={item.sort}>
                    <Card>
                      <Card.Header
                        title={item.name}
                        thumb={shu}
                        extra={
                          item.canRemove && 
                          <a style={{fontSize: 14}} onClick={_ => handleRemove(item)}>删除</a>
                        }
                      />
                      <Card.Body>
                        <List style={{fontSize: 12}}>
                          {
                            item?.controlList.map(formList => {
                              let formId: string | number = formList.id;
                              formId = `${formId}-$-${formList.baseControlType}-$-${formList.defaultValue}-$-${formList.defaultShowValue}-$-${item.sort}-$-${formList.name}`;
                              formList.formnameid = formId;
                              return (
                                <div key={formList.id + '-' + item.sort}>
                                  <Form.Item
                                    noStyle
                                    name={`${formId}`}
                                    initialValue={formList.defaultShowValue || formList.defaultValue}
                                    rules={[{required: formList.isRequired === 1}]}
                                  >
                                    <FormBase data={formList} setFieldsValue={form.setFieldsValue}></FormBase>
                                  </Form.Item>
                                </div>
                              )
                            })
                          }
                        </List>
                      </Card.Body>
                      {
                        (item?.type === 1 && item?.canAdd )&&
                        <Card.Footer content={<a onClick={_ => handleAdd(item)}>添加{item?.name}</a>} />
                      }
                    </Card>
                    <WhiteSpace size="lg" />
                  </div>
                )
              })
            }
            <Button type="primary" style={{touchAction: 'none'}} disabled={loading} loading={loading} onClick={_ => form.submit()}>提交</Button>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </Form>
          :
          <StepFlow data={flowSteps} type="initial" />
        }
      </WingBlank>
    </div>
  )
}