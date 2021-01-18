import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { history } from 'umi';
import { Button, Result, Avatar, Tag, Input, Card } from 'antd';
import { CrownOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import useArticleContent from '@/hooks/useArticleContent';

function articleContent(props) {
  const {
    match: {
      params: { title = 'xxx' },
    },
  } = props;
  const [record, loading, getRecord, saveRecord] = useArticleContent();
  const [value, setValue] = useState('');

  return (
    <Card title={title} bordered={false}>
      <Input value={value} onChange={e => setValue(e.target.value)} />
      <Button onClick={() => {}}>保存</Button>
    </Card>
  );
}

export default articleContent;
