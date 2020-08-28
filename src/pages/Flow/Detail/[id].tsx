import React, { useEffect, useState } from 'react';
import {
  queryDetail, IFormDetail, queryRule, IFlowStep,
  queryButton, IButton, processFlow, cancelFlow,
  queryFlowAdvice, IAdvice
} from './services/detail';
import { GlobalResParams } from '@/utils/global';
import { useModel } from 'umi';
import {
  WingBlank, SegmentedControl, WhiteSpace, Card,
  List, Button, Toast, TextareaItem, Flex, Modal
} from 'antd-mobile';
import { FormBase } from '../Initial/components/form_base';
import { createForm } from 'rc-form';
import shu from '@/assets/shu.png';
import styles from './detail.less';
import StepFlow from '@/pages/Flow/components/StepFlow';
import { toShow, toFormData } from '../Initial/components/form_function';

const Item = List.Item;
const Brief = Item.Brief;

const DetailContent = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(true);
  const [detail, setDetail] = useState<IFormDetail>();
  const { setBarName } = useModel('useBarName');
  const id = Number(props.match.params.id);
  const { getFieldError, getFieldDecorator, setFieldsValue } = props.form;
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

  const handleSubmit = (type: number) => {
    props.form.validateFields(async (error: any, values: any) => {
      if (!error) {
        setLoading(true);
        let formData: any[] = [];
        let { remark } = values;
        delete values.remark;
        Object.keys(values).map(item => {
          let formDataItem = toFormData(item, values[item], 'resFormControlId');
          formData.push(formDataItem);
        });
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
    });
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
          <div>
            {
              detail?.formChildlist?.map(item => {
                return (
                  <div key={item.id}>
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
                              formId = `${formId}-$-${formList.baseControlType}-$-${formList.value}-$-${formList.showValue}`;
                              let formValue: any = toShow(formList);
                              formList.userName = formList.showValue;
                              formList.formnameid = formId;
                              let formRules = false;
                              if (formList.isRequired === 1 && formList.baseControlType !== 'user') {
                                formRules = true;
                              }
                              return (
                                <div key={formList.id}>
                                  {
                                    getFieldDecorator(`${formId}`, {
                                      rules: formRules,
                                      initialValue: formValue,
                                    })
                                    (<FormBase data={formList} setFieldsValue={setFieldsValue}></FormBase>)
                                  }
                                  <div style={{color: 'red'}}>
                                    {(getFieldError(`${formId}`) && `${formList.name}必填`)}
                                  </div>
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
                      <Item multipleLine extra={item.apprUserTruename} key={item.taskApprStepId} wrap>
                        <span className={styles.stepBgd}>{item.stepNumber}</span>
                        {item.stepName}-{adviceStatus[item.apprStatus]}
                        <div className={styles.flowRemark}>{item.apprRemark}</div>
                        <Brief>{item.apprTime}</Brief>
                      </Item>
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
                {
                  getFieldDecorator('remark')
                  (<TextareaItem
                    placeholder="签字意见"
                    autoHeight
                  />)
                }
                </Card.Body>
              </Card>
            }
            <WhiteSpace size="lg" />
            <Flex>
              {buttons?.approver && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} type="primary" onClick={_ => handleSubmit(1)}>通过</Button></Flex.Item>}
              {buttons?.approver && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} onClick={_ => handleSubmit(2)}>驳回</Button></Flex.Item>}
              {buttons?.submit && <Flex.Item><Button size="small" style={{touchAction: 'none'}} disabled={loading} loading={loading} type="primary" onClick={_ => handleSubmit(3)}>提交</Button></Flex.Item>}
              {buttons?.applicant && <Flex.Item><Button size="small" style={{touchAction: 'none'}} type="warning" onClick={handleCancel}>撤销</Button></Flex.Item>}
            </Flex>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </div>
          :
          <div>
            <StepFlow data={flowSteps} type="" />
          </div>
        }
      </WingBlank>
    </div>
  )
}

export default createForm()(DetailContent);