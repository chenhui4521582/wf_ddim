import request from '@/utils/request';
import { PaginationTableParams } from '@/utils/global';

export interface INoticeList {
  content: string;
  createTime: string;
  id: number;
  reading: number;
  title: string;
  userName: string;
}

export async function queryNotice(data: PaginationTableParams) {
  return request('/api/talentIm/announcement/listAll', {
    method: 'post',
    data
  });
}

export async function detailNotice(id: number) {
  return request('/api/talentIm/announcement/getInfoById', {
    method: 'post',
    data: { id }
  });
}

export async function addRead(id: number) {
  return request('/api/talentIm/announcement/addReading', {
    method: 'post',
    data: { id }
  });
}