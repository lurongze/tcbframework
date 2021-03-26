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
import styles from './editor.less';

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

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.preview}>markdown preview</div>
        <div className={styles.sepLine} />
        <div className={styles.editor}>
          <Editor
            height="100%"
            width="100%"
            language="markdown"
            value={record?.content || ''}
            editorDidMount={(e, ed) => {
              // setIsEditorReady(true);
              ed.onKeyDown(kd => {
                setIsEditor(true);
                // ctrl+s 保存内容
                if (kd?.ctrlKey && kd.keyCode === 49) {
                  kd.preventDefault();
                  saveArticle(false);
                }
              });
              editorRef.current = e;
            }}
          />
        </div>
      </div>
      <div className={styles.toolBar}>
        <Button type="primary">保存</Button>
      </div>
    </div>
  );
}

export default articleContent;
