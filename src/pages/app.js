import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { history } from 'umi';
import useLogin from '@/hooks/useLogin';
import styles from './index.less';

function Index() {
  const [initing, setIniting] = useState(true);
  const isLogin = useLogin();
  useEffect(() => {
    if(!isLogin){
      return history.push('/login')
    }
  }, [isLogin]);

  return initing ? (
    <Empty description="页面初始化中..." image={Empty.PRESENTED_IMAGE_SIMPLE} />
  ) : (
    <div className={styles.body}>系统页面</div>
  );
}

export default Index;
