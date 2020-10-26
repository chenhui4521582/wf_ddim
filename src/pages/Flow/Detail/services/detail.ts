import request from '@/utils/request';

export interface IFormList {
  baseControlType: string;
  isLocked: 1 | 0;
  isRequired: 1 | 0;
  name: string;
  id: number;
  defaultValue: any;
  defaultShowValue: any;
  value: any;
  showValue: any;
  resFormControlId: number;
  userName: string;
  formnameid: string;
}

export interface IFormDetail {
  formChildlist: {
    controlList: IFormList[];
    id: number;
    name: string;
    type: number;
    canAdd: boolean;
    multipleNumber: number;
    sort: number;
  }[];
  name: string;
  id: number;
  resApprovalId: number;
}
export async function queryDetail(id: number) {
  return request('/api/talentIm/wftaskformForIm/getDetail', {
    method: 'post',
    data: { id }
  });
}

export interface IAdvice {
  stepName: string;
  apprStatus: 0 | 1 | 2 | 3;
  apprTime: string;
  apprRemark: string;
  stepNumber: number;
  apprUserTruename: string;
  taskApprStepId: number;
}

export async function queryFlowAdvice(taskFormId: number) {
  return request('/api/talentIm/wftaskapprstepForIm/queryWfLogList', {
    method: 'post',
    data: { taskFormId }
  });
}

export interface IButton {
  applicant: boolean;
  approver: boolean;
  submit: boolean;
}

// 获取按钮权限
export async function queryButton(taskFormId: number) {
  return request('/api/talentIm/wftaskapprstepForIm/queryButtonPermission', {
    method: 'post',
    data: { taskFormId }
  });
}

// 通过或者驳回
export async function processFlow(data: any) {
  return request('/api/talentIm/wftaskformForIm/processTaskForm', {
    method: 'post',
    data
  });
}

// 撤销
export async function cancelFlow(id: number) {
  return request('/api/talentIm/wftaskformForIm/canceled', {
    method: 'post',
    data: { id }
  });
}

export interface IFlowStep {
  stepName: string;
  id: number;
  stepNumber: number;
  currentNode: boolean;
  apprStatus: 0 | 1 | 2 | 3 | 4;
  currentStepUserNames: string;
}

export async function queryRule(taskFormId: number) {
  return request('/api/talentIm/wftaskapprstepForIm/queryStepLogList', {
    method: 'post',
    data: { taskFormId }
  });
}