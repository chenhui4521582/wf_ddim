import React from 'react';
import FlowList from '@/pages/Flow/components/flow_list';
import { dealedListPage } from '../services/dealed';

export default () => {
  return (
    <FlowList queryMethod={dealedListPage} />
  )
}