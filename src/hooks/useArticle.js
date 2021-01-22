import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { helper } from '@/utils';
import cloudFunc from '@/utils/cloudFunc';

function useArticle() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  function getList(cateId) {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('article')
        .where({ cateId, _openid: cloudFunc.getUID() })
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
            message.success('删除成功！');
            getList(cateId);
          } else {
            message.error('删除失败！');
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
              message.success('新增成功!');
              // console.log('values.noteId', values.noteId)
              // getList(values.noteId);
              cloudFunc
                .getDB()
                .collection('articleContent')
                .add({ articleId: res.id, addTime: new Date() });
              helper.isFuncAndRun(callback);
            } else {
              message.error('新增失败！');
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
              message.success('保存成功！');
              // getList(values.noteId);
            } else {
              message.error('保存失败！');
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

export default useArticle;
