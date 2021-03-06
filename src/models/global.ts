import { GlobalResParams } from '@/utils/global';
import { useState, useEffect } from 'react';
import {
  queryOrganization,
  queryDepartment,
  queryLabor,
  queryTitle,
  queryJob,
  queryRank,
  queryCompany,
  queryCost,
  queryMRank,
  queryWKTask,
  queryVacationType,
  querySignType,
} from '@/services/global';

export interface IOrganization {
  name: string;
  code: string;
  id: number;
  children?: IOrganization[];
  memberList: IOrganization[];
}

export const useOrganization = () => {
  const [ogs, setOgs] = useState<IOrganization[]>([]);
  const getOrganization = async () => {
    let res: GlobalResParams<IOrganization[]> = await queryOrganization();
    setOgs(res?.obj);
  };
  useEffect(() => {
    getOrganization();
  }, []);
  return { ogs };
};

export interface IDepartment {
  name: string;
  code: string;
}

export const useDepartment = (level: number) => {
  const [dps, setDps] = useState<IDepartment[]>([]);
  const getDepartment = async () => {
    let res: GlobalResParams<IDepartment[]> = await queryDepartment(level);
    setDps(res?.obj);
  };
  useEffect(() => {
    getDepartment();
  }, []);
  return { dps };
};

export interface ILabor {
  id: number;
  laborRelationName: string;
}

export const useLabor = () => {
  const [labors, setLabors] = useState<ILabor[]>([]);
  const getLabor = async () => {
    let res: GlobalResParams<ILabor[]> = await queryLabor();
    setLabors(res?.obj);
  };
  useEffect(() => {
    getLabor();
  }, []);
  return { labors };
};

export interface ITitle {
  titleId: string;
  titleName: string;
}

export const useTitle = () => {
  const [titles, setTitles] = useState<ITitle[]>([]);
  const getTitle = async () => {
    let res: GlobalResParams<ITitle[]> = await queryTitle();
    setTitles(res?.obj);
  };
  useEffect(() => {
    getTitle();
  }, []);
  return { titles };
};

export interface IJob {
  jobId: string;
  jobName: string;
}

export const useJob = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const getJob = async () => {
    let res: GlobalResParams<IJob[]> = await queryJob();
    setJobs(res?.obj);
  };
  useEffect(() => {
    getJob();
  }, []);
  return { jobs };
};

export interface IRank {
  rankName: string;
  rankId: string;
}

export const useRank = () => {
  const [ranks, setRanks] = useState<IRank[]>([]);
  const getRank = async () => {
    let res: GlobalResParams<IRank[]> = await queryRank();
    setRanks(res?.obj);
  };
  useEffect(() => {
    getRank();
  }, []);
  return { ranks };
};

export interface IMRank {
  rankName: string;
  rankId: string;
}

export const useMRank = () => {
  const [mranks, setMRanks] = useState<IMRank[]>([]);
  const getMRank = async () => {
    let res: GlobalResParams<IMRank[]> = await queryMRank();
    setMRanks(res?.obj);
  };
  useEffect(() => {
    getMRank();
  }, []);
  return { mranks };
};

export interface ICompany {
  companyName: string;
  companyId: number;
}

export const useCompany = () => {
  const [companys, setCompanys] = useState<ICompany[]>([]);
  const getCompany = async () => {
    let res: GlobalResParams<ICompany[]> = await queryCompany();
    setCompanys(res?.obj);
  };
  useEffect(() => {
    getCompany();
  }, []);
  return { companys };
};

export interface ICost {
  costCenterName: string;
  id: number;
}

export const useCost = () => {
  const [costs, setCosts] = useState<ICost[]>([]);
  const getCost = async () => {
    let res: GlobalResParams<ICost[]> = await queryCost();
    setCosts(res?.obj);
  };
  useEffect(() => {
    getCost();
  }, []);
  return { costs };
};

export interface IWKTask {
  title: string;
  id: number;
}

export interface IWKRes {
  list: IWKTask[];
}

export const useWKTask = () => {
  const [tasks, setTasks] = useState<IWKTask[]>([]);
  const getTasks = async () => {
    let res: GlobalResParams<IWKRes> = await queryWKTask();
    setTasks(res?.obj?.list);
  };
  useEffect(() => {
    getTasks();
  }, []);
  return { tasks };
};

export interface List {
  type: Number;
  typeId: String;
  name: String;
}

export const useVacationType = () => {
  const [list, setList] = useState<List[]>([]);
  async function _getVacationType() {
    let res: GlobalResParams<List[]> = await queryVacationType();
    if (res?.status === 200) {
      setList(res.obj);
    }
  }
  useEffect(() => {
    _getVacationType();
  }, []);
  return { list };
};

export interface signType {
  desc: String;
  code: Number;
}

export const useAddSignType = () => {
  const [signType, setSignType] = useState<signType[]>([]);
  async function _getSignType() {
    let res: GlobalResParams<signType> = await querySignType();
    console.log(res);
    if (res?.status === 200) {
      setSignType(res.obj);
    }
  }
  useEffect(() => {
    _getSignType();
  }, []);
  return { signType };
};
