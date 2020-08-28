import request from '@/utils/request';
import { PaginationTableParams } from '@/utils/global';

// 待办事项
export async function dealingListPage(params: PaginationTableParams) {
  return request(`/api/talentIm/wftaskformForIm/listTodoFormPage`, {
    method: 'POST',
    data: params,
  });
}