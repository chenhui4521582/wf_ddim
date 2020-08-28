import React from 'react';
import FlowList from '@/pages/Flow/components/flow_list';
import { myListPage } from '../services/my';

export default () => {
  return (
    <FlowList queryMethod={myListPage} />
  )
}