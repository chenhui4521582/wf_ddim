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
    data: { id },
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
  wfTaskFormFilesCrudParamList: [];
}

export async function saveFlow(data: ISaveFlow) {
  return request('/api/talentIm/wftaskformForIm/saveTaskForm', {
    method: 'post',
    data,
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
    data: { resApprovalId },
  });
}

export interface ICurrentControl {
  name: String;
  endTime: any;
  startTime: any;
  type: String | Number;
  typeId: String | Number;
  apiType: String | Number;
  userCode: String;
  lock: Boolean;
}

export interface IVacationTime {
  time: Number;
  unit: Number;
  isTrue: Boolean;
  reason: String;
}

/** 获取请假/销假类型 总计时长 **/
export function queryTotalVacationTime(params: ICurrentControl) {
  return request(`/api/talentIm/attendenceControl/vacationTime`, {
    method: 'POST',
    data: params,
  });
}

export interface IOverTimeParams {
  overTimeEnd: String;
  overTimeStart: String;
}

export interface IOverTimeRes {
  hour: Number;
}

/** 获取加班类型 总计时长 **/
export function queryTotalOvertime(params: IOverTimeParams) {
  return request(`/api/talentIm/attendenceControl/overTime`, {
    method: 'POST',
    data: params,
  });
}

export interface IRemainCardNumberRes {
  surplus: Number;
}

/** 获取补卡剩余次数 **/
export function queryRemainCardNumber(userCode: String) {
  return request(`/api/talentIm/attendenceControl/archiveReplaceCardNumber`, {
    method: 'POST',
    data: { userCode },
  });
}

export interface IOutcheckTimeParams {
  outcheckTimeEnd: String;
  outcheckTimeStart: String;
}

export interface IOutcheckTimeRes {
  hour: Number;
}

/** 获取补卡剩余次数 **/
export function queryTotalOutcheckTime(params: IOutcheckTimeParams) {
  return request(`/api/talentIm/attendenceControl/getOutCheckTime`, {
    method: 'POST',
    data: params,
  });
}

export interface IAvailableTimeRes {
  currentLeft: Number;
}

/** 获取可休年假天数 **/
export function queryAvailableTime(userCode: String) {
  return request(`/api/talentIm/attendenceControl/getAvailableTime`, {
    method: 'POST',
    data: { userCode },
  });
}
