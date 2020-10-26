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
      res?.obj.formChildlist.map(item => {
        if (item.type === 1) {
          item.canAdd = true
        }
        item.multipleNumber = 1;
      });
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

  const handleAdd = (childList: any) => {
    const newList = {...childList};
    detail?.formChildlist.map(item => {
      if(item.id === newList.id) item.canAdd = false;
    })
    newList.canRemove = true;
    newList.canAdd = true;
    newList.sort = newList.sort + 10000;
    newList.multipleNumber = newList.multipleNumber + 1;
    let data;
    detail && (data = {
      ...detail,
      formChildlist: [
        ...detail?.formChildlist,
        newList
      ]
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

  const handleSubmit = () => {
    debugger
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
                              formId = `${formId}-$-${formList.baseControlType}-$-${formList.defaultValue}-$-${formList.defaultShowValue}-$-${item.multipleNumber}`;
                              formList.formnameid = formId;
                              return (
                                <div key={formList.id + '-' + item.sort}>
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