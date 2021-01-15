import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
import cloudFunc from '@/utils/cloudFunc';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import { message } from 'antd';

const NoteModel = {
  namespace: 'noteModel',
  state: {
    notes: [],
  },
  effects: {
    *query({ payload }, { call, put }) {},
    *queryNotes({ payload }, { call, put }) {
      const res = yield call(cloudFunc.queryNotes);
      yield put({
        type: 'save',
        payload: {
          notes: res?.data || [],
        },
      });
    },
    *deleteNote({ payload }, { call, put }) {
      const res = yield call(cloudFunc.deleteNote, payload.id);
      if (res?.deleted && +res.deleted !== 0) {
        isFuncAndRun(payload?.success);
      } else {
        message.error('删除失败！');
      }
    },
    *saveNote({ payload }, { call, put }) {
      const res = yield call(cloudFunc.saveNote, payload);
      if ((res?.updated && +res.updated !== 0) || !isEmpty(res?.id)) {
        isFuncAndRun(payload?.success);
      } else {
        message.error('保存失败！');
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
  },
};
export default NoteModel;
