import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { history } from 'umi';
import { Button, Result, Avatar, Tag, Input } from 'antd';
import { CrownOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import useLogin from '@/hooks/useLogin';
import Index from './index';
import styles from './index.less';

const defaultProps = {
  routes: [
    {
      path: '/index',
      name: '笔记管理',
      icon: <CrownOutlined />,
    },
  ],
};

function App(props) {
  const { children } = props;
  const [initing, setIniting] = useState(true);
  const [route, setRoute] = useState(() => {
    return defaultProps;
  });

  const isLogin = useLogin();
  useEffect(() => {
    if (!isLogin) {
      return history.push('/login');
    }
  }, [isLogin]);

  useEffect(() => {
    setIniting(false);
  }, []);

  return initing ? (
    <Empty description="页面初始化中..." image={Empty.PRESENTED_IMAGE_SIMPLE} />
  ) : (
    <ProLayout
      route={route}
      navTheme="light"
      fixSiderbar
      headerRender={false}
      onMenuHeaderClick={e => console.log(e)}
      menuItemRender={(item, dom) => (
        <a
          onClick={() => {
            return history.push(item.path || '/index');
          }}
        >
          {dom}
        </a>
      )}
      rightContentRender={() => (
        <div>
          <Avatar shape="square" size="small" icon={<UserOutlined />} />
        </div>
      )}
    >
      <PageContainer
        // onBack={() => null}
        // tags={<Tag color="blue">状态一</Tag>}
        header={{
          style: {
            padding: '4px 16px',
            position: 'fixed',
            top: 0,
            width: '100%',
            left: 0,
            zIndex: 999,
            boxShadow: '0 2px 8px #f0f1f2',
          },
        }}
        style={{
          paddingTop: 48,
        }}
        extra={[
          <Input.Search
            key="search"
            style={{
              width: 240,
            }}
          />,
          <Button key="3">操作一</Button>,
          <Button key="2" type="primary">
            操作一
          </Button>,
        ]}
      >
        {children}
      </PageContainer>
    </ProLayout>
  );
}

export default App;
