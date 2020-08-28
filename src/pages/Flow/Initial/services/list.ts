import request from '@/utils/request';

export interface IFlowList {
  id: number;
  name: string;
  icon: string;
  text: string;
}

export interface IFlowRes {
  listForm: IFlowList[];
  name: string;
  id: number;
}

export async function queryFlows() {
  return request('/api/talentIm/wfresform/list', {
    method: 'post',
  });
}