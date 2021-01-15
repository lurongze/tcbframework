import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import Editor from '@/components/article/editor';
import Article from '@/components/article/article';

function ArticleArea(props) {
  const {
    global: { currentArticle = {} },
  } = props;
  const [viewContent, setViewContent] = useState(true);

  useEffect(()=>{
    setViewContent(true);
  },[currentArticle]);

  return viewContent ? (
    <Article
      onClickEdit={() => {
        setViewContent(false);
      }}
    />
  ) : (
    <Editor
      onSaveSuccess={() => {
        setViewContent(true);
      }}
    />
  );
}

export default connect(({ global }) => ({
  global,
}))(ArticleArea);
