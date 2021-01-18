import React, { useEffect, useState } from 'react';
import { Message } from 'antd';
import helper from '@/utils/helper';
import cloudFunc from '@/utils/cloudFunc';

function useCategory() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  function getList(cateId) {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('article')
        .where({ cateId })
        .orderBy('sort', 'asc')
        .limit(1000)
        .get()
        .then(res => {
          setList(res?.data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function deleteRecord(id, cateId) {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('article')
        .doc(id)
        .remove()
        .then(res => {
          if (res?.deleted) {
            Message.success('删除成功！');
            getList(cateId);
          } else {
            Message.error('删除失败！');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function saveRecord(values) {
    console.log('saveNote', values);
    const { _id = '', edit, _openid, success, callback, ...resValues } = values;
    let id = _id;
    // if (_id.startsWith('tmp')) {
    //   id = '';
    // }

    if (id === '') {
      if (!loading) {
        setLoading(true);
        return cloudFunc
          .getDB()
          .collection('article')
          .add({ ...resValues, addTime: new Date() })
          .then(res => {
            if (res?.id) {
              Message.success('新增成功！');
              // console.log('values.noteId', values.noteId)
              // getList(values.noteId);
              cloudFunc
                .getDB()
                .collection('articleContent')
                .add({ articleId: res.id, addTime: new Date() });
              helper.isFuncAndRun(callback);
            } else {
              Message.error('新增失败！');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      if (!loading) {
        setLoading(true);
        return cloudFunc
          .getDB()
          .collection('article')
          .doc(id)
          .update({ ...resValues, updateTime: new Date() })
          .then(res => {
            if (res?.updated) {
              Message.success('保存成功！');
              // getList(values.noteId);
            } else {
              Message.error('保存失败！');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }

  return [list, loading, getList, saveRecord, deleteRecord];
}

export default useCategory;
