import React, { useEffect, useState } from 'react';
import {
  queryDetail, IFormDetail, queryRule, IFlowStep,
  queryButton, IButton, processFlow, cancelFlow,
  queryFlowAdvice, IAdvice,
  ICurrentControl, 
} from './services/detail';
import {
  queryTotalVacationTime, IOverTimeParams, IVacationTime,
  IOverTimeRes, queryTotalOvertime, IOutcheckTimeParams,
  IOutcheckTimeRes, queryTotalOutcheckTime,
  IRemainCardNumberRes, queryRemainCardNumber,
  IAvailableTimeRes, queryAvailableTime
} from '@/pages/Flow/Initial/services/detail';
import { GlobalResParams } from '@/utils/global';
import { getUnitType } from '@/services/global';
import { useModel } from 'umi';
import { Form } from 'antd';
import {
  WingBlank, SegmentedControl, WhiteSpace, Card,
  List, Button, Toast, TextareaItem, Flex, Modal
} from 'antd-mobile';
import { FormBase } from '../Initial/components/form_base';
import shu from '@/assets/shu.png';
import styles from './detail.less';
import StepFlow from '@/pages/Flow/components/StepFlow';
import { toShow, toFormData } from '../Initial/components/form_function';
import moment from 'moment';
const Item = List.Item;
const Brief = Item.Brief;
const validateMessages = {
  required: "'${name}' 是必填字段",
};
interface IUnitList {
  code: number;
  desc: string;
}
export default (props: any) => {
  let _currentControl = {} as ICurrentControl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(true);
  const [detail, setDetail] = useState<IFormDetail>();
  const { setBarName } = useModel('useBarName');
  const id = Number(props.match.params.id);
  const [selected, setSelected] = useState(0);
  const [advices, setAdvices] = useState<IAdvice[]>([]);
  const [buttons, setButtons] = useState<IButton>();
  const [flowSteps, setFlowSteps] = useState<IFlowStep[]>([]);
  const [unitList, steUnitList] = useState<IUnitList[]>();
  const [userCode, setUserCode] = useState<String>();
  const [controlList, setControlList] = useState<any[]>([]);
  const adviceStatus = {
    0: '没处理',
    1: '通过',
    2: '退回',
    3: '已提交',
    4: '已撤销'
  }
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<IFormDetail> = await queryDetail(id);
      let json1: GlobalResParams<IUnitList[]> = await getUnitType();
      let list: any[] = []
      if (json1.status === 200) {
        steUnitList(json1?.obj);
      }
      res?.obj.formChildlist.map((item) => {
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
      setControlList(list);
      setUserCode(userCode);
    }
    getDetail();
  }, [refresh]);

  useEffect(() => {
    async function getRule() {
      let res: GlobalResParams<IFlowStep[]> = await queryRule(id);
      setFlowSteps(res?.obj);
    }
    getRule();
  }, [refresh]);

  useEffect(() => {
    async function getAdvice() {
      let res: GlobalResParams<IAdvice[]> = await queryFlowAdvice(id);
      const newAdvices = res?.obj?.reverse();
      setAdvices(newAdvices);
    }
    getAdvice();
  }, [refresh]);

  useEffect(() => {
    async function getButtons() {
      let res: GlobalResParams<IButton> = await queryButton(id);
      setButtons(res?.obj);
    }
    getButtons();
  }, [refresh]);

  const changeMenu = (e: any) => {
    setSelected(e.nativeEvent.selectedSegmentIndex);
  }

  const countInArray = (array: number[], what: number) => {
    return array.filter(item => item == what).length;
  }

  const handleSubmit = async (type: number) => {
    let values = form.getFieldsValue();
    setLoading(true);
    let formData: any[] = [];
    let { remark } = values;
    delete values.remark;
    Object.keys(values).map(item => {
      let formDataItem = toFormData(item, values[item], 'resFormControlId', unitList);
      formData.push(formDataItem);
    });
    let idArray: number[] = [];
    formData.map(item => {
      let count = countInArray(idArray, item.resFormControlId);
      if (count > 0) {
        item.multipleNumber = item.multipleNumber + count;
      }
      idArray.push(item.resFormControlId);
    })
    let res: GlobalResParams<string> = await processFlow({
      remark,
      taskFormId: id,
      type,
      wfResFormUpdateItemCrudParamList: formData,
      wfTaskFormFilesCrudParamList: []
    });
    setLoading(false);
    if (res.status === 200) {
      setRefresh(!refresh);
      Toast.success(res.msg, 2);
    }
  }

  const handleError = ({errorFields}: any) => {
    let messages = errorFields[0].errors[0].split("'")[1].split('-$-')[5] + errorFields[0].errors[0].split("'")[2];
    Toast.fail(messages, 2);
  }

  const handleCancel = () => {
    Modal.alert('撤销', '是否撤销此流程，此操作不可恢复？', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: async () => {
        let res: GlobalResParams<string> = await cancelFlow(id);
        if (res.status === 200) {
          setRefresh(!refresh);
          Toast.success(res.msg, 2);
        }
      }}
    ])
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
      console.log(name)
      let allControl = allValues;
      console.log(allControl)
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
          <Form form={form} onValuesChange={onValuesChange} onFinish={_ => handleSubmit(1)} onFinishFailed={handleError} validateMessages={validateMessages}>
            {
              detail?.formChildlist?.map(item => {
                return (
                  <div key={item.id + '' + item.sort}>
                    <Card>
                      <Card.Header
                        title={item.name}
                        thumb={shu}
                      />
                      <Card.Body>
                        <List style={{fontSize: 12}}>
                          {
                            item?.controlList.map((formList) => {
                              let formId: string | number = formList.resFormControlId;
                              formId = `${formId}-$-${formList.baseControlType}-$-${formList.value}-$-${formList.showValue}-$-${item.sort}`;
                              let formValue: any = toShow(formList);
                              formList.userName = formList.showValue;
                              formList.formnameid = formId;
                              let formRules = false;
                              if (formList.isRequired === 1 && formList.baseControlType !== 'user') {
                                formRules = true;
                              }
                              return (
                                <div key={formId + '' + item.sort}>
                                  <Form.Item
                                    noStyle
                                    name={`${formId}`}
                                    initialValue={formValue}
                                    rules={[{required: formRules}]}
                                  >
                                    <FormBase data={formList} setFieldsValue={form.setFieldsValue}></FormBase>
                                  </Form.Item>
                                </div>
                              )
                            })
                          }
                        </List>
                      </Card.Body>
                    </Card>
                    <WhiteSpace size="lg" />
                  </div>
                )
              })
            }
            <Card>
              <Card.Header
                title='流转意见'
                thumb={shu}
              />
              <Card.Body>
                <List>
                {
                  advices.map(item => {
                    return (
                      <div id="advices" key={item.taskApprStepId}>
                        <Item multipleLine extra={item.apprUserTruename} wrap>
                          <span className={styles.stepBgd}>{item.stepNumber}</span>
                          {item.stepName}-{adviceStatus[item.apprStatus]}
                          <div className={styles.flowRemark}>{item.apprRemark}</div>
                          <Brief>{item.apprTime}</Brief>
                        </Item>
                      </div>
                    )
                  })
                }
                </List>
              </Card.Body>
            </Card>
            <WhiteSpace size="lg" />
            {
              (buttons?.submit || buttons?.approver || buttons?.applicant)
              &&
              <Card>
                <Card.Body>
                  <Form.Item
                    noStyle
                    name='remark'
                  >
                    <TextareaItem
                      placeholder="签字意见"
                      autoHeight
                    />
                  </Form.Item>
                </Card.Body>
              </Card>
            }
            <WhiteSpace size="lg" />
            <Flex>
              {buttons?.approver && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} type="primary" onClick={_ => form.submit()}>通过</Button></Flex.Item>}
              {buttons?.approver && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} onClick={_ => handleSubmit(2)}>驳回</Button></Flex.Item>}
              {buttons?.submit && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} type="primary" onClick={_ => handleSubmit(3)}>提交</Button></Flex.Item>}
              {buttons?.applicant && <Flex.Item><Button size="small" style={{touchAction: 'none'}} type="warning" onClick={handleCancel}>撤销</Button></Flex.Item>}
            </Flex>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </Form>
          :
          <div>
            <StepFlow data={flowSteps} type="" />
          </div>
        }
      </WingBlank>
    </div>
  )
};