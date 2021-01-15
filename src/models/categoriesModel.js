import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import cloudFunc from '@/utils/cloudFunc';
import { isFuncAndRun, array2Tree } from '@/utils/helper';

const CategoriesModel = {
  namespace: 'categoriesModel',
  state: {
    categories: [],
  },
  effects: {
    *query({ payload }, { call, put }) {},
    *queryCategories({ payload }, { call, put }) {
      const res = yield call(cloudFunc.queryCategories, payload);
      const resList = res?.data || [];
      yield put({
        type: 'save',
        payload: {
          categories: resList,
        },
      });
    },
    *deleteCategory({ payload }, { call, put }) {
      const res = yield call(cloudFunc.deleteCategory, payload.id);
      isFuncAndRun(payload?.success);
    },
    *saveCategory({ payload }, { call, put }) {
      const res = yield call(cloudFunc.saveCategory, payload);
      isFuncAndRun(payload?.success);
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default CategoriesModel;
