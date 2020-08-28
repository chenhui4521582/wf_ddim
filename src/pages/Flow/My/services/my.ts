import request from '@/utils/request';
import { PaginationTableParams } from '@/utils/global';

// 我的列表
export async function myListPage(params: PaginationTableParams) {
  return request(`/api/talentIm/wftaskformForIm/listMyFormPage`, {
    method: 'POST',
    data: params,
  });
}