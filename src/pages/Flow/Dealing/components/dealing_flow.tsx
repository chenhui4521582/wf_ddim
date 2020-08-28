import React from 'react';
import FlowList from '@/pages/Flow/components/flow_list';
import { dealingListPage } from '../services/dealing';

export default () => {
  return (
    <FlowList queryMethod={dealingListPage} type="dealing" />
  )
}