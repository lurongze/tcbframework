import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { history } from 'umi';
import { Button, Result, Avatar, Tag, Input, Card } from 'antd';
import { CrownOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import useLogin from '@/hooks/useLogin';
import Index from './index';
import styles from './index.less';

function articleContent(props) {
  const {
    match: {
      params: { title = '' },
    },
  } = props;

  return (
    <Card title={title} bordered={false}>
      <div>{title}</div>
    </Card>
  );
}

export default articleContent;
