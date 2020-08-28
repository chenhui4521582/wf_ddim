import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { GlobalResParams } from '@/utils/global';
import { detailNotice, INoticeList, addRead } from './services/notice';
import styles from './List.less';

export default (props: any) => {
  const id = Number(props.match.params.id);
  const { setBarName } = useModel('useBarName');
  const [detail, setDetail] = useState<INoticeList>();
  const getDetail = async () => {
    let res: GlobalResParams<INoticeList> = await detailNotice(id);
    setDetail(res.obj);
  }
  const addReading = async () => {
    await addRead(id);
  }
  useEffect(() => {
    setBarName('公告详情');
    getDetail();
    addReading();
  }, []);
  return (
    <div className={styles.detailContent}>
      <div className={styles.title}>{detail?.title}:</div>
      <div className={styles.created}>{detail?.createTime} {detail?.userName}</div>
      <div dangerouslySetInnerHTML={{__html: (detail?.content || '')}}></div>
      <div className={styles.reading}>阅读 {detail?.reading}</div>
    </div>
  )
}