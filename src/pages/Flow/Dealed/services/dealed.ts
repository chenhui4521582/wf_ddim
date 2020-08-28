import request from '@/utils/request';
import { PaginationTableParams } from '@/utils/global';

// 已办事项
export async function dealedListPage(params: PaginationTableParams) {
  return request(`/api/talentIm/wftaskformForIm/listDoneFormPage`, {
    method: 'POST',
    data: params,
  });
}