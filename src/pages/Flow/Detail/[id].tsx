import React, { useEffect, useState } from 'react';
import {
  queryDetail, IFormDetail, queryRule, IFlowStep,
  queryButton, IButton, processFlow, cancelFlow,
  queryFlowAdvice, IAdvice
} from './services/detail';
import { GlobalResParams } from '@/utils/global';
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

const Item = List.Item;
const Brief = Item.Brief;

const validateMessages = {
  required: "'${name}' 是必填字段",
};

export default (props: any) => {
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
      // res?.obj.formChildlist.map(item => {
      //   if (item.type === 1) {
      //     item.canAdd = true
      //   }
      //   item.multipleNumber = 1;
      // });
      setDetail(res?.obj);
      setBarName(res?.obj?.name);
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
      let formDataItem = toFormData(item, values[item], 'resFormControlId');
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
          <Form form={form} onFinish={_ => handleSubmit(1)} onFinishFailed={handleError} validateMessages={validateMessages}>
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
}

// export default createForm()(DetailContent);