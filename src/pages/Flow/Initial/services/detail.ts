import request from '@/utils/request';

export interface IFormList {
  baseControlType: string;
  isLocked: 1 | 0;
  isRequired: 1 | 0;
  name: string;
  id: number;
  defaultValue: any;
  defaultShowValue: any;
  formnameid: string;
}

export interface IFormDetail {
  formChildlist: {
    controlList: IFormList[];
    id: number;
    name: string;
    type: 0 | 1 | 2;
    canRemove: boolean;
    canAdd: boolean;
    multipleNumber: number;
    sort: number;
  }[];
  name: string;
  id: number;
  resApprovalId: number;
}
export async function queryDetail(id: number) {
  return request('/api/talentIm/wfresform/getDetail', {
    method: 'post',
    data: { id }
  });
}

export interface IFormData {
  id: number | string;
  multipleNumber: 1;
  showValue: string | null;
  value: string;
}

interface ISaveFlow {
  resFormId: string | number;
  wfResFormSaveItemCrudParamList: IFormData[];
  wfTaskFormFilesCrudParamList: []
}

export async function saveFlow(data: ISaveFlow) {
  return request('/api/talentIm/wftaskformForIm/saveTaskForm', {
    method: 'post',
    data
  });
}

export interface IFlowStep {
  stepName: string;
  id: number;
  stepNumber: number;
  currentStepUserNames: string;
  apprStatus: 0 | 1 | 2 | 3;
  currentNode: boolean;
}

export async function queryRule(resApprovalId: number) {
  return request('/api/talentIm/wfresapprstep/listByApprovalId', {
    method: 'post',
    data: { resApprovalId }
  });
}