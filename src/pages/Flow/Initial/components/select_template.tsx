import React from 'react';
import { Picker, List } from 'antd-mobile';
import {
  useOrganization, useDepartment, useLabor, useTitle, useJob, useRank, useCompany, useCost, useMRank, useWKTask
} from '@/models/global';
import styles from './selectTemplate.less';

interface ISelectParams {
  data: any;
  newProps: any;
  type: string;
}

interface IPickerData {
  value: string;
  label: string;
  children?: IPickerData[]
}
export default (props: ISelectParams) => {
  const { data: { itemList, name, isRequired }, newProps, type } = props;
  let dataSource: IPickerData[] = [];
  let cols: number = 0;
  if (type === 'select') {
    if (Object.prototype.toString.call(itemList) === '[object String]') {
      itemList?.split('|').map((item: any) => {
        dataSource.push({ value: item, label: item });
      })
    }
    cols = 1;
  } else if (type === 'user') {
    const { ogs } = useOrganization();
    dataSource = loopData(ogs);
    cols = 5;
  } else if (type === 'business') {
    const { dps } = useDepartment(1);
    dataSource = loopData(dps);
    cols = 1;
  } else if (type === 'company') {
    const { companys } = useCompany();
    dataSource = loopCompany(companys);
    cols = 1;
  } else if (type === 'position') {
    const { titles } = useTitle();
    dataSource = loopTitle(titles);
    cols = 1;
  } else if (type === 'job') {
    const { jobs } = useJob();
    dataSource = loopJob(jobs);
    cols = 1;
  } else if (type === 'positionLevel') {
    const { ranks } = useRank();
    dataSource = loopRank(ranks);
    cols = 1;
  } else if (type === 'positionMLevel') {
    const { mranks } = useMRank();
    dataSource = loopRank(mranks);
    cols = 1;
  }else if (type === 'business2') {
    const { dps } = useDepartment(2);
    dataSource = loopData(dps);
    cols = 1;
  } else if (type === 'depGroup') {
    const { ogs } = useOrganization();
    dataSource = loopData(ogs);
    cols= 4;
  } else if (type === 'group') {
    const { dps } = useDepartment(4);
    dataSource = loopData(dps);
    cols= 1;
  } else if (type === 'labor') {
    const { labors } = useLabor();
    dataSource = loopLabor(labors);
    cols= 1;
  } else if (type === 'cost') {
    const { costs } = useCost();
    dataSource = loopCost(costs);
    cols= 1;
  } else if (type === 'wkTask') {
    const { tasks } = useWKTask();
    dataSource = loopTask(tasks);
    cols= 1;
  }

  return (
    <Picker
      {...newProps}
      title={name}
      data={dataSource}
      cols={cols}
      extra={
        type==='user' ? newProps.username : null
      }
    >
      <List.Item arrow="horizontal" wrap={true}>
        <span className={newProps.disabled ? styles.selectDisabled : null}>{name}</span>
        {isRequired === 1 && <span style={{color: 'red'}}>*</span>}
      </List.Item>
    </Picker>
  )
}

const loopData = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.code + '---' + item.name,
      label: item.name
    };
    if (item.children) {
      result.children = loopData(item.children);
    }
    if (item.memberList?.length > 0) {
      result.children = loopData(item.memberList);
    }
    return result;
  })
}

const loopCompany = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.companyId + '---' + item.companyName,
      label: item.companyName
    };
    return result;
  })
}

const loopTitle = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.titleId + '---' + item.titleName,
      label: item.titleName
    };
    return result;
  })
}

const loopJob = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.jobId + '---' + item.jobName,
      label: item.jobName
    };
    return result;
  })
}

const loopRank = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.rankId + '---' + item.rankName,
      label: item.rankName
    };
    return result;
  })
}

const loopLabor = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.id + '---' + item.laborRelationName,
      label: item.laborRelationName
    };
    return result;
  })
}

const loopCost = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.id + '---' + item.costCenterName,
      label: item.costCenterName
    };
    return result;
  })
}

const loopTask = (data: any[]) => {
  return data?.map((item: any) => {
    const result: IPickerData = {
      value: item.id + '---' + item.title,
      label: item.title
    };
    return result;
  })
}