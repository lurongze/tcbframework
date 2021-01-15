import React, { useEffect, useState, useRef } from 'react';
import { Spin, Button } from 'antd';

function Index(props) {
  const { title } = props;
  const [count, setCount] = useState(0);

  return (
    <Spin spinning={loading}>
      <div>点击次数：{count}</div>
      <Button onClick={() => setCount(count + 1)}>+点击按钮{title}</Button>
    </Spin>
  );
}

export default Index;
