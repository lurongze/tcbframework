import { Effect, Reducer } from 'umi';

const GlobalModel = {
  namespace: 'global',
  state: {
    showNav: true,
    currentNote: {},
    currentCategory: {},
    currentArticle: {},
  },
  effects: {
    *query({ payload }, { call, put }) {},
  },
  reducers: {
    toggleNav(state) {
      return {
        ...state,
        showNav: !state.showNav,
      };
    },
    selectNote(state, action) {
      return {
        ...state,
        currentNote: action.payload,
        currentCategory: {},
        currentArticle: {},
      };
    },
    selectCategory(state, action) {
      return {
        ...state,
        currentCategory: action.payload,
        currentArticle: {},
      };
    },
    selectArticle(state, action) {
      return {
        ...state,
        currentArticle: action.payload,
      };
    },
  },
};
export default GlobalModel;
