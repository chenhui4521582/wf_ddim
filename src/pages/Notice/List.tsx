import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { ListView, List } from 'antd-mobile';
import { GlobalResParams } from '@/utils/global';
import { queryNotice, INoticeList } from './services/notice';
import styles from './List.less';

interface IPagination {
  list: INoticeList[];
  pages: number;
  pageNum: number;
  total: number;
}

export default () => {
  const { setBarName } = useModel('useBarName');
  const [listData, setListData] = useState<INoticeList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<number>(1);
  const [pageNum, setPageNum] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const getList = async () => {
    setIsLoading(true);
    let res: GlobalResParams<IPagination> = await queryNotice({
      pageSize: 10,
      pageNum: pageNum + 1,
    });
    if (res.obj) {
      if (pageNum === 0) {
        setListData(res?.obj?.list);
      } else {
        setListData([...listData, ...res?.obj?.list]);
      }
      setPageNum(res?.obj?.pageNum);
      setPages(res?.obj?.pages);
      setIsLoading(false);
      if (res?.obj?.pageNum >= res?.obj?.pages) {
        setMessage('没有更多数据了');
      } else {
        setMessage('加载完成');
      }
    } else {
      setMessage(res.msg);
    }
  }
  useEffect(() => {
    setBarName('公告');
    getList();
  }, []);

  const onEndReached = () => {
    if (isLoading || (pageNum >= pages)) {
      return;
    }
    getList();
  }
  
  const toDetail = (data: any) => {
    history.push(`/notice/${data.id}`)
  }

  const MyBody = ({row}: any) => {
    return (
      <List>
        <List.Item
          align="top"
          multipleLine
          onClick={_ => toDetail(row)}
          wrap
        >
          <div className={styles.listTitle}>{ row.title }:</div>
          <div dangerouslySetInnerHTML={{__html: row.content}}></div>
          <div className={styles.listTime}>{ row.createTime }</div>
        </List.Item>
      </List>
    )
  }
  const ds = new ListView.DataSource({ rowHasChanged: (r1: any, r2: any) => r1 !== r2 });
  return (
    <ListView
      dataSource={ds.cloneWithRows(listData)}
      renderFooter={() => (<div style={{ padding: 40, textAlign: 'center' }}>
        {message}
      </div>)}
      renderRow={row => (<MyBody row={row} />)}
      useBodyScroll
      onScroll={() => { console.log('scroll'); }}
      scrollRenderAheadDistance={500}
      onEndReached={onEndReached} 
      onEndReachedThreshold={10}
    />
  )
}