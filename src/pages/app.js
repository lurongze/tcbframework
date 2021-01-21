import React, { useEffect, useState, cloneElement } from 'react';
import { Empty, Modal } from 'antd';
import { history } from 'umi';
import { Button, Avatar } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import cloudFunc from '@/utils/cloudFunc';
import useNotes from '@/hooks/useNotes';

const defaultRoute = [
  {
    path: '/',
    name: '笔记管理',
    icon: <SettingOutlined />,
  },
];

function App(props) {
  const { children } = props;
  const [initing, setIniting] = useState(true);
  const [route, setRoute] = useState([]);
  const [noteList, _, getNoteList] = useNotes();

  useEffect(() => {
    console.log('useEffect');

    cloudFunc.getLoginState().then(res => {
      if (
        res?._loginType &&
        res._loginType === 'EMAIL' &&
        cloudFunc.checkHasLogin
      ) {
        setIniting(false);
        getNoteList();
      } else {
        return history.push('/login');
      }
    });
  }, []);

  useEffect(() => {
    if (route.length === 0) {
      const resList = noteList.map(s => {
        return {
          path: `/category/${s._id}/${encodeURIComponent(s.title)}`,
          name: s.title,
          icon: <BookOutlined />,
        };
      });
      setRoute(resList);
    }
  }, [noteList]);

  function loginOut() {
    Modal.confirm({
      title: '确认退出登录吗？',
      okText: '退出',
      cancelText: '取消',
      onOk() {
        cloudFunc.signOut();
        history.push('/login');
      },
    });
  }

  return initing ? (
    <Empty description="页面初始化中..." image={Empty.PRESENTED_IMAGE_SIMPLE} />
  ) : (
    <ProLayout
      route={{
        routes: [...defaultRoute, ...route],
      }}
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
        title="Adroit Book"
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
          <Button key="2" onClick={loginOut}>
            退出登录
            <LogoutOutlined />
          </Button>,
        ]}
      >
        {cloneElement(children, {
          onChangeRoute(res) {
            setRoute(res);
          },
        })}
      </PageContainer>
    </ProLayout>
  );
}

export default App;
