import React, { useEffect, useState } from 'react';
import { Grid } from 'antd-mobile';
import { queryFlows, IFlowList, IFlowRes } from '../services/list';
import { GlobalResParams } from '@/utils/global';
import styles from './initial_flow.less';
import { history } from 'umi';
import defaultIcon from '@/assets/default.png';

export default () => {
  const [flows, setFlows] = useState<IFlowRes[]>([]);
  useEffect(() => {
    async function getFlows() {
      let res: GlobalResParams<IFlowRes[]> = await queryFlows();
      if (res.status === 200) {
        const data = res?.obj;
        data?.map((item: IFlowRes) => {
          item.listForm?.map((listdata: IFlowList) => {
            listdata.text = listdata.name;
            listdata.icon = listdata.icon || defaultIcon;
          })
        });
        setFlows(data);
      } else {
        setFlows([])
      }
    }
    getFlows();
  }, []);

  const handleClick = (value: any) => {
    history.push(`/flow/initial/${value.id}`);
  }
  return (
    <div className={styles.bgd}>
      {
        flows.map(item => {
          return (
            <div key={item.id}>
              <div className={styles.subTitle}>{item.name}</div>
              <Grid
                data={item.listForm}
                columnNum={3}
                onClick={handleClick}
                renderItem={dataItem => (
                  <div style={{ padding: '12.5px' }}>
                    <img src={dataItem?.icon} style={{ width: '30px', height: '30px' }} alt="" />
                    <div style={{ color: '#888', fontSize: '14px', marginTop: '12px' }}>
                      <span>{dataItem?.text}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          )
        })
      }
    </div>
  )
}