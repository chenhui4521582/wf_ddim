import React, { useState, useEffect } from 'react';
import { List, ListView, SearchBar, Icon, Picker } from 'antd-mobile';
import { Tag } from 'antd';
import { GlobalResParams } from '@/utils/global';
import { queryModuleCategory } from '@/services/global';
import { history } from 'umi';
import moment from 'moment';
import styles from './flowList.less';

const { Item } = List;
const { Brief } = Item;

interface IFlowListParams {
  name: string;
  title: string;
  status: -1 | 0 | 1 | 2 | 3;  //-1:删除;0:已撤销;1:审批中;2:已通过;3:已驳回;
  createTime: string;
  statusStr: string;
  id: number;
}

interface IPagination {
  list: IFlowListParams[];
  pages: number;
  pageNum: number;
  total: number;
}

interface IModuleItem {
  name: string;
  id: number;
}

interface IPickerParams {
  label: string;
  value: string | number;
}

interface ISearchParams {
  status: number | string;
  categoryId: number | string;
  date: number | string;
  title: string;
}

export default (props: any) => {
  const { queryMethod, type } = props;
  const [listData, setListData] = useState<IFlowListParams[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<number>(1);
  const [pageNum, setPageNum] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [modules, setModules] = useState<IPickerParams[]>([]);

  const [search, setSearch] = useState<ISearchParams>({
    status: '', categoryId: '', date: '', title: ''
  });

  const statusColor: any = {
    '-1': '#9688C6',
    '0': '#999999',
    '1': '#338CDF',
    '2': '#63B578',
    '3': '#E47272'
  };

  const statusSelect = [{
    value: '', label: '全部'
  }, {
  //   value: -1, label: '已删除'
  // }, {
    value: 0, label: '已撤销'
  }, {
    value: 1, label: '审批中'
  }, {
    value: 2, label: '已通过'
  }, {
    value: 3, label: '已驳回'
  }];

  const dateSelect = [{
    value: '', label: '全部',
  }, {
    value: 7, label: '近7日'
  }, {
    value: 30, label: '近30日'
  }, {
    value: 178, label: '近半年'
  }];

  const filterData = (data: IPickerParams[], selectedData: string | number, allName: string) => {
    if (selectedData === '') {
      return allName
    }
    const result = data.filter(item => item.value === selectedData);
    return result[0].label;
  }

  const fixSearch = () => {
    let searchData = {};
    Object.keys(search).map(item => {
      // @ts-ignore
      if (search[item] !== '') {
        if (item === 'date') {
          const dateNumber = Number(search.date);
          // @ts-ignore
          searchData.createTimeStart = moment(new Date(Date.now() - dateNumber * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');
        } else {
          // @ts-ignore
          searchData[item] = search[item];
        }
      }
    });
    return searchData;
  }

  const getDataList = async (refreshPageNum: number) => {
    setIsLoading(true);
    setMessage('加载中...');
    let res: GlobalResParams<IPagination> = await queryMethod({
      pageSize: 10,
      pageNum: refreshPageNum + 1,
      ...fixSearch()
    });
    if (res.obj) {
      if (refreshPageNum === 0) {
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

  const getModuleList = async () => {
    let res: GlobalResParams<IModuleItem[]> = await queryModuleCategory();
    let pickerData: IPickerParams[] = [{ label: '全部', value: '' }];
    res.obj?.map(item => {
      pickerData.push({ label: item.name, value: item.id });
    })
    setModules(pickerData);
  }

  useEffect(() => {
    getDataList(0);
  }, [search.status, search.categoryId, search.date])

  useEffect(() => {
    getModuleList();
  }, [])

  const clickItem = (data: IFlowListParams) => {
    history.push(`/flow/detail/${data.id}`);
  }

  const ds = new ListView.DataSource({ rowHasChanged: (r1: any, r2: any) => r1 !== r2 });
  const MyBody = ({row}: any) => {
    return (
      <List>
        <Item
          extra={<Tag style={{borderRadius: 20}}
          color={statusColor[row.status]}>{row.statusStr}</Tag>}
          align="top"
          multipleLine
          onClick={_ => clickItem(row)}
          wrap
        >
          { row.name }
          <div className={styles.listDiv}>{ row.title }</div>
          <div className={styles.listDiv}>{ row.createTime }</div>
        </Item>
      </List>
    )
  }
  const onEndReached = () => {
    if (isLoading || (pageNum >= pages)) {
      return;
    }
    getDataList(pageNum);
  }

  const handleChange = (value: any, name: 'status' | 'categoryId' | 'date' | 'title') => {
    if (name === 'title')
      search[name] = value;
    else
      search[name] = value[0];
    setSearch({...search});
  }

  const submitValue = () => {
    getDataList(0);
  }

  const clearValue = () => {
    search.title = '';
    setSearch({...search});
    submitValue();
  }

  return (
    <div>
      <SearchBar
        value={search.title}
        onChange={value => handleChange(value, 'title')}
        onSubmit={submitValue}
        placeholder="搜索人名、标题、内容"
        onClear={clearValue}
      />
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', background:'#fff', height: 50, color: '#333'}}>
        {
          type !== 'dealing' &&
          <Picker
            title="审批状态"
            cols={1}
            data={statusSelect}
            value={[search.status]}
            onChange={value => handleChange(value, 'status')}
          >
            <div>
              {filterData(statusSelect, search.status, '审批状态')}
              <Icon type="down" size="xxs" />
            </div>
          </Picker>
        }
        <Picker
          title="模板类型"
          cols={1}
          data={modules}
          value={[search.categoryId]}
          onChange={value => handleChange(value, 'categoryId')}
        >
          <div>
            {filterData(modules, search.categoryId, '模板类型')}
            <Icon type="down" size="xxs" />
          </div>
        </Picker>
        <Picker
          title="提交日期"
          cols={1}
          data={dateSelect}
          value={[search.date]}
          onChange={value => handleChange(value, 'date')}
        >
          <div>
            {filterData(dateSelect, search.date, '提交日期')}
            <Icon type="down" size="xxs" />
          </div>
        </Picker>
      </div>
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
    </div>
  )
}