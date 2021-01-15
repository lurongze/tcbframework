import React from 'react';
import { isFuncAndRun } from '@/utils/helper';
import { Modal } from 'antd';
import { connect } from 'umi';
import { HomeFilled, LogoutOutlined } from '@ant-design/icons';
import styles from './mainBar.less';

function MainBar(props) {
  const { dispatch, onSignOut } = props;

  return (
    <div className={styles.mainBar}>
      <div
        className={styles.mainBarItem}
        onClick={() => {
          dispatch({
            type: 'global/toggleNav',
          });
        }}
      >
        <HomeFilled style={{ color: '#1890ff' }} />
      </div>
      <div
        className={styles.mainBarItem}
        title="退出登录"
        onClick={() => {
          Modal.confirm({
            title: '确认退出登录吗？',
            okText: '退出',
            cancelText: '取消',
            onOk: () => {
              isFuncAndRun(onSignOut);
            },
          });
        }}
      >
        <LogoutOutlined />
      </div>
    </div>
  );
}

export default connect(({ global, noteModel, loading }) => ({
  global,
  noteModel,
  loading: loading.models.noteModel,
}))(MainBar);
