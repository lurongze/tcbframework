import React, { useEffect, useState, useRef } from 'react';
import { Empty } from 'antd';
import { history } from 'umi';
import {
  Button,
  Result,
  Avatar,
  Menu,
  Dropdown,
  PageHeader,
  message,
  Modal,
} from 'antd';
import classnames from 'classnames';
import Editor from '@monaco-editor/react';
import {
  CrownOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import useArticleContent from '@/hooks/useArticleContent';
import Picture from '@/components/article/picture';
import { helper } from '@/utils';
import styles from './index.less';

function articleContent(props) {
  const {
    match: {
      params: { title = 'xxx', articleId = '' },
    },
    onChangeRoute,
  } = props;
  const editorRef = useRef();
  const [isEditor, setIsEditor] = useState(false);
  const [record, loading, getRecord, saveRecord] = useArticleContent();
  const [value, setValue] = useState('');

  function doSave(goBack = false) {
    const content = editorRef.current() || '';
    if (helper.isEmpty(content)) {
      return message.error('内容为空，无法保存！');
    }
    saveRecord({
      ...record,
      content,
      callback() {
        if (goBack) {
          history.goBack();
        }
      },
    });
  }

  useEffect(() => {
    if (articleId) {
      getRecord(articleId);
    }
  }, [articleId]);

  return (
    <PageHeader
      ghost={false}
      onBack={null}
      title={decodeURIComponent(title)}
      extra={[
        <Button
          key="test"
          type="primary"
          onClick={() => {
            helper.isFuncAndRun(onChangeRoute, [
              {
                path: '/articleContent',
                name: '笔记内容管理',
              },
            ]);
          }}
        >
          测试
        </Button>,
        <Button key="save" type="primary" onClick={doSave}>
          <SaveOutlined />
          保存
        </Button>,
        <Picture key="picture">
          <Button type="primary" style={{ marginLeft: 15 }}>
            <PictureOutlined />
            图片上传
          </Button>
        </Picture>,
        <Button
          key="back"
          onClick={() => {
            if (isEditor) {
              Modal.confirm({
                title: '内容已被编辑过，是否直接返回',
                onOk() {
                  history.goBack();
                },
              });
            } else {
              history.goBack();
            }
          }}
        >
          返回
        </Button>,
      ]}
    >
      <Editor
        className={styles.editorItem}
        height="calc(100vh - 180px)"
        language="markdown"
        value={record?.content || ''}
        editorDidMount={(e, ed) => {
          // setIsEditorReady(true);
          ed.onKeyDown(kd => {
            // ctrl+s 保存内容
            if (kd?.ctrlKey && kd.keyCode === 49) {
              kd.preventDefault();
              saveArticle(false);
            }
          });
          editorRef.current = e;
        }}
      />
    </PageHeader>
  );
}

export default articleContent;
