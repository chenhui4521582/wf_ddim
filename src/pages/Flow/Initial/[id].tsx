import React, { useEffect, useState } from 'react';
import { queryDetail, IFormDetail, saveFlow, queryRule, IFlowStep } from './services/detail';
import { GlobalResParams } from '@/utils/global';
import { useModel, history } from 'umi';
import { WingBlank, SegmentedControl, WhiteSpace, Card, List, Button, Toast } from 'antd-mobile';
import { FormBase } from './components/form_base';
import { createForm } from 'rc-form';
import shu from '@/assets/shu.png';
import StepFlow from '@/pages/Flow/components/StepFlow';
import { toFormData } from './components/form_function';

const menuData = [
  {
    value: '1',
    label: 'Food',
  }, {
    value: '2',
    label: 'Supermarket',
  },
  {
    value: '3',
    label: 'Extra',
    isLeaf: true,
  },
];

const DetailContent = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<IFormDetail>();
  const { setBarName } = useModel('useBarName');
  const id = Number(props.match.params.id);
  const { getFieldError, getFieldDecorator, setFieldsValue } = props.form;
  const [selected, setSelected] = useState(0);
  const [resApprovalId, setResApprovalId] = useState(-1);
  const [flowSteps, setFlowSteps] = useState<IFlowStep[]>([]);
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<IFormDetail> = await queryDetail(id);
      setDetail(res?.obj);
      setBarName(res?.obj?.name);
      setResApprovalId(res?.obj?.resApprovalId);
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

  const handleSubmit = () => {
    props.form.validateFields(async (error: any, values: any) => {
      if (!error) {
        setLoading(true);
        let formData: any[] = [];
        Object.keys(values).map(item => {
          let formDataItem = toFormData(item, values[item], 'id');
          formData.push(formDataItem);
        });
        let res: GlobalResParams<string> = await saveFlow({
          resFormId: id,
          wfResFormSaveItemCrudParamList: formData,
          wfTaskFormFilesCrudParamList: []
        });
        setLoading(false);
        if (res.status === 200) {
          history.goBack();
          Toast.success(res.msg, 2);
        }
      }
    });
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
                            item?.controlList.map(formList => {
                              let formId: string | number = formList.id;
                              formId = `${formId}-$-${formList.baseControlType}-$-${formList.defaultValue}-$-${formList.defaultShowValue}`;
                              formList.formnameid = formId;
                              return (
                                <div key={formList.id}>
                                  {
                                    getFieldDecorator(`${formId}`, {
                                      rules: [{required: formList.isRequired === 1}],
                                      initialValue: formList.defaultShowValue || formList.defaultValue,
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
            <Button type="primary" style={{touchAction: 'none'}} disabled={loading} loading={loading} onClick={handleSubmit}>提交</Button>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
          </div>
          :
          <StepFlow data={flowSteps} type="initial" />
        }
      </WingBlank>
    </div>
  )
}

export default createForm()(DetailContent);