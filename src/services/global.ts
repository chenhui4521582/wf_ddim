import request from '@/utils/request';

// 模板类型
export async function queryModuleCategory() {
  return request(`/api/talentIm/wfResFormCategory/getCategoryList`, {
    method: 'POST'
  });
}

// 获取组织架构主体
export async function queryOrganization() {
  return request(`/api/talentIm/department/listOrganization`, {
    method: 'POST',
  });
}

// 获取业务线
export async function queryBusiness() {
  return request(`/api/odsApi/business/listBusinessLineOption`, {
    method: 'POST',
  });
}

// 部门下拉 1: 一级业务线  2: 二级业务线  3:部门  4:组别
export async function queryDepartment(level: number) {
  return request(`/api/talentIm/employeeRoster/listDepartment`, {
    method: 'POST',
    data: { level },
  });
}

// 公司下拉
export async function queryCompany() {
  return request(`/api/talentIm/company/listCompanyOption`, {
    method: 'POST'
  });
}

// 劳动关系下拉
export async function queryLabor() {
  return request(`/api/talentIm/laborRelation/listOption`, {
    method: 'POST'
  });
}

// 职位
export async function queryTitle() {
  return request(`/api/talentIm/employeeRoster/listTitle`, {
    method: 'POST'
  });
}

// 职位
export async function queryJob() {
  return request(`/api/talentIm/job/listJobOption`, {
    method: 'POST'
  });
}

// 职级
export async function queryRank() {
  return request(`/api/talentIm/employeeRoster/listRank`, {
    method: 'POST'
  });
}

// 管理职级
export async function queryMRank() {
  return request(`/api/talentIm/employeeRoster/listManagementRank`, {
    method: 'POST'
  });
}


// 成本中心
export async function queryCost() {
  return request(`/api/talentIm/costCenter/listOption`, {
    method: 'POST'
  });
}