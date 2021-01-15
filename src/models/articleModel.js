import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import cloudFunc from '@/utils/cloudFunc';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import { message } from 'antd';

const ArticleModel = {
  namespace: 'articleModel',
  state: {
    articles: [],
    articleContent: {},
  },
  effects: {
    *query({ payload }, { call, put }) {},
    *queryArticles({ payload }, { call, put }) {
      const res = yield call(cloudFunc.queryArticles, payload);
      yield put({
        type: 'save',
        payload: {
          articles: res?.data || [],
        },
      });
    },
    *deleteArticle({ payload }, { call, put }) {
      const res = yield call(cloudFunc.deleteArticles, payload.id);
      if (res?.deleted && +res.deleted !== 0) {
        isFuncAndRun(payload?.success);
      } else {
        message.error('删除失败！');
      }
    },
    *saveArticle({ payload }, { call, put }) {
      const res = yield call(cloudFunc.saveArticle, payload);
      if ((res?.updated && +res.updated !== 0) || !isEmpty(res?.id)) {
        if (!isEmpty(res?.id)) {
          yield call(cloudFunc.addArticleContent, {
            articleId: res.id,
            content: '',
          });
        }
        isFuncAndRun(payload?.success);
      } else {
        message.error('保存失败！');
      }
    },
    *getArticleContent({ payload }, { call, put }) {
      const res = yield call(cloudFunc.getArticleContent, payload);
      const resData = res?.data || [];
      let resContent = {};
      if (resData.length) {
        resContent = resData[0];
      } else {
        resContent = {
          isAdd: true,
          articleId: payload.articleId,
          content: '## 请输入你的文章标题',
        };
      }
      yield put({
        type: 'saveContent',
        payload: {
          articleContent: resContent,
        },
      });
    },
    *saveArticleContent({ payload }, { call, put }) {
      const { content } = payload;
      if (!isEmpty(content)) {
        const res = yield call(cloudFunc.updateArticleContent, payload);
        if ((res?.updated && +res.updated !== 0) || !isEmpty(res?.id)) {
          isFuncAndRun(payload?.success);
        } else {
          message.error('保存失败！');
        }
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveContent(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default ArticleModel;
