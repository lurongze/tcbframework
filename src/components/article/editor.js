import React, { useEffect, useRef, useState } from 'react';
import { message, Button } from 'antd';
import { connect } from 'umi';
import classnames from 'classnames';
import {
  FundViewOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import { mdToHtml } from '@/utils/markdownit';
import Editor from '@monaco-editor/react';
import Picture from './picture';
import styles from './index.less';

// const languageList = ['markdown', 'javascript'];

function EditorItem(props) {
  const {
    global: { currentArticle = {} },
    articleModel: { articleContent = {} },
    dispatch,
    submiting,
    onSaveSuccess,
  } = props;
  const editorRef = useRef();
  const [isEditorReady, setIsEditorReady] = useState(false);
  // const [language, setLanguage] = useState(languageList[0]);

  function saveArticle(runCallback = true) {
    const content = editorRef.current() || '';
    if(isEmpty(content)){
      return null;
    }
    const parseResult = mdToHtml(content);
    dispatch({
      type: 'articleModel/saveArticleContent',
      payload: {
        ...parseResult,
        articleId: currentArticle._id,
        content,
        success() {
          message.info('保存成功！');
          if (runCallback) {
            isFuncAndRun(onSaveSuccess);
          }
        },
      },
    });
  }

  function getContent(articleId) {
    dispatch({
      type: 'articleModel/getArticleContent',
      payload: { articleId },
    });
  }

  useEffect(() => {
    if (!isEmpty(currentArticle?._id)) {
      getContent(currentArticle._id);
    }
  }, [currentArticle]);


  // const menu = (
  //   <Menu>
  //     {languageList.map(s => (
  //       <Menu.Item key={s} onClick={() => setLanguage(s)}>
  //         {s}
  //       </Menu.Item>
  //     ))}
  //   </Menu>
  // );

  return (
    <div className={classnames(styles.editorContainer)}>
      <Editor
        height="calc(100vh - 50px)"
        language="markdown"
        className={styles.editorItem}
        value={articleContent?.content || ''}
        editorDidMount={(e, ed) => {
          setIsEditorReady(true);
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
      <div className={styles.footer}>
        <Button
          loading={submiting}
          disabled={!isEditorReady}
          className={styles.buttons}
          type="primary"
          onClick={saveArticle}
        >
          <SaveOutlined />
          保存
        </Button>

        {/* <Button
          loading={loading}
          disabled={!isEditorReady}
          className={styles.buttons}
          type="primary"
          onClick={() => {
            saveArticle();
            isFuncAndRun(onSaveSuccess);
          }}
        >
          <FundViewOutlined />
          查看文章
        </Button> */}

        <Picture>
          <Button
            disabled={!isEditorReady}
            className={styles.buttons}
            type="primary"
          >
            <PictureOutlined />
            图片上传
          </Button>
        </Picture>
        {/* <Dropdown.Button
          className={styles.buttons}
          trigger={['click']}
          overlay={menu}
          disabled={!isEditorReady}
        >
          当前语言：{language}
        </Dropdown.Button> */}
      </div>
    </div>
  );
}

export default connect(({ global, articleModel, loading }) => ({
  global,
  articleModel,
  loading: loading.effects['articleModel/getArticleContent'],
  submiting: loading.effects['articleModel/saveArticleContent'],
}))(EditorItem);
