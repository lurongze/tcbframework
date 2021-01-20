import { Effect, Reducer } from 'umi';

const GlobalModel = {
  namespace: 'global',
  state: {
    count: 0,
  },
  effects: {
    *query({ payload }, { call, put }) {},
  },
  reducers: {
    addCount(state) {
      return {
        ...state,
        count: state.count + 1,
      };
    },
  },
};
export default GlobalModel;
