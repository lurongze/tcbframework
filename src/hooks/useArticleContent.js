import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { helper } from '@/utils';
import cloudFunc from '@/utils/cloudFunc';

function useCategory() {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);

  function getRecord(articleId) {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('articleContent')
        .where({ articleId })
        .limit(1)
        .get()
        .then(res => {
          if (res?.data && res.data.length > 0) {
            setRecord(res.data[0]);
          } else {
            addRecord(articleId);
          }
        })
        .finally(() => setLoading(false));
    }
  }

  function addRecord(articleId) {
    if (!loading) {
      setLoading(true);
      const addRow = {
        articleId,
        content: '',
        updateTiem: new Date(),
        addTime: new Date(),
      };
      cloudFunc
        .getDB()
        .collection('articleContent')
        .add(addRow)
        .then(res => {
          if (res?.id) {
            setRecord({ _id: res.id, ...addRow });
          } else {
            message.error('初始化信息错误！');
          }
        })
        .finally(() => setLoading(false));
    }
  }

  function saveRecord(values) {
    const { _id = '', edit, _openid, success, callback, ...resValues } = values;
    let id = _id;
    if (!loading) {
      setLoading(true);
      return cloudFunc
        .getDB()
        .collection('articleContent')
        .doc(id)
        .update({ ...resValues, updateTime: new Date() })
        .then(res => {
          if (res?.updated) {
            message.success('保存成功！');
            // getList(values.noteId);
            helper.isFuncAndRun(callback);
          } else {
            message.error('保存失败！');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return [record, loading, getRecord, saveRecord];
}

export default useCategory;
