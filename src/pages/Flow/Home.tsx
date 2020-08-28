import React, { useEffect } from 'react';
import { TabBar } from 'antd-mobile';
import InitialFlow from './Initial/components/initial_flow';
import MyFlow from './My/components/my_flow';
import DealingFlow from './Dealing/components/dealing_flow';
import DealedFlow from './Dealed/components/dealed_flow';
import styles from './home.less';
import { useModel } from 'umi';

export default (props: any) => {
  const { setBarName } = useModel('useBarName');
  const { selectedTab, setSelectedTab } = useModel('useSelectedTab');
  const renderContent = () => {
    if (selectedTab === 'initial') return <InitialFlow />;
    if (selectedTab === 'myflow') return <MyFlow />;
    if (selectedTab === 'dealing') return <DealingFlow />;
    if (selectedTab === 'dealed') return <DealedFlow />;
  };
  useEffect(() => {
    if (selectedTab === 'initial') setBarName('发起流程');
    if (selectedTab === 'myflow') setBarName('我的流程');
    if (selectedTab === 'dealing') setBarName('待办事宜');
    if (selectedTab === 'dealed') setBarName('已办事宜');
  }, [selectedTab])
  return (
    <div>
      {renderContent()}
      <div className={styles.homeBar}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={false}
        >
          <TabBar.Item
            title="发起流程"
            key="initial"
            icon={<div className={styles.initialPic} />}
            selectedIcon={<div className={styles.initialPicSelected} />}
            selected={selectedTab === 'initial'}
            onPress={() => {
              setSelectedTab('initial');
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={styles.myPic} />}
            selectedIcon={<div className={styles.myPicSelected} />}
            title="我的流程"
            key="myflow"
            selected={selectedTab === 'myflow'}
            onPress={() => {
              setSelectedTab('myflow');
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={styles.dealing} />}
            selectedIcon={<div className={styles.dealingSelected} />}
            title="待办事宜"
            key="dealing"
            selected={selectedTab === 'dealing'}
            onPress={() => {
              setSelectedTab('dealing');
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={styles.dealed} />}
            selectedIcon={<div className={styles.dealedSelected} />}
            title="已办事宜"
            key="dealed"
            selected={selectedTab === 'dealed'}
            onPress={() => {
              setSelectedTab('dealed');
            }}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    </div>
  )
}