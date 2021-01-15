import React, { createElement, useEffect } from 'react';
import { Button, Empty } from 'antd';
import { connect } from 'umi';
import classnames from 'classnames';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import Dir from '@/components/article/dir';
import 'github-markdown-css/github-markdown.css';
import styles from './index.less';

function Article(props) {
  const {
    global: { currentArticle = {} },
    articleModel: { articleContent = {} },
    dispatch,
    loading,
    onClickEdit,
    onlyView = false,
  } = props;

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

  const renderers = {
    code: ({ language, value }) => {
      return (
        <SyntaxHighlighter style={theme} language={language} children={value} />
      );
    },
    heading: ({ level, children }) => {
      return createElement(
        `h${level}`,
        { id: children[0]?.props?.value || '' },
        children,
      );
    },
  };

  return (
    <div className={classnames(styles.articleContentContainer)}>
      <div className={styles.markdownContent}>
        {!isEmpty(articleContent?.content) && (
          <>
            <ReactMarkdown
              className="markdown-body"
              allowDangerousHtml
              renderers={renderers}
              linkTarget="_blank"
              plugins={[gfm]}
              children={articleContent?.content || ''}
            />
            <Dir dirList={articleContent?.dirList || []} />
          </>
        )}
        {loading && (
          <Empty
            className="markdown-body"
            description={
              <>
                <LoadingOutlined /> 加载中...
              </>
            }
            style={{ marginTop: '30%' }}
          />
        )}
        {isEmpty(articleContent?.content) && !loading && (
          <Empty
            className="markdown-body"
            description="暂无数据"
            style={{ marginTop: '30%' }}
          />
        )}
      </div>
      {!onlyView && (
        <div className={styles.footer}>
          <Button
            onClick={() => {
              isFuncAndRun(onClickEdit);
            }}
            loading={loading}
            className={styles.buttons}
            type="primary"
          >
            <EditOutlined />
            编辑文章
          </Button>
        </div>
      )}
    </div>
  );
}

export default connect(({ global, articleModel, loading }) => ({
  global,
  articleModel,
  loading: loading.effects['articleModel/getArticleContent'],
}))(Article);
