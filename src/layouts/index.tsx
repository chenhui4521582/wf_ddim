import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { useModel, history } from 'umi';
import { appCall } from '@/utils/bridge.js';

export default (props: any) => {
  const { barName } = useModel('useBarName');

  const closeWindow = () => {
    appCall.callIOSHandler("ddimCloseWindow", {}, function() {
      console.log('close window');
    });
  }

  const goBack = () => {
    if (history.location.pathname === '/flow/home' || history.location.pathname === '/notice/list') {
      closeWindow();
    } else {
      history.goBack();
    }
  }

  return (
    <div>
      <NavBar
        mode="light"
        icon={<Icon style={{color: '#fff'}} size="lg" type="left" />}
        onLeftClick={goBack}
        style={{
          background: '#338CDF', color: '#fff',
          height: 'calc(50px + env(safe-area-inset-top))',
          position: 'fixed', top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          paddingTop: 'env(safe-area-inset-top)'
        }}
        rightContent={
          <Icon onClick={closeWindow} style={{color: '#fff'}} type="cross" size="lg" />
        }
      >
        <span style={{color: '#fff'}}>{barName}</span>
      </NavBar>
      <div style={{height: 50}}></div>
      {props.children}
    </div>
  )
}