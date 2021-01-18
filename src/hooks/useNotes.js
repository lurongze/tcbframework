import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import cloudFunc from '@/utils/cloudFunc';

function useNotes() {
  const [list, setList] = useState([]);
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(false);

  function getList() {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('notes')
        .orderBy('sort', 'asc')
        .limit(100)
        .get()
        .then(res => {
          setList(res?.data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function deleteNote(id) {
    if (!loading) {
      setLoading(true);
      cloudFunc
        .getDB()
        .collection('notes')
        .doc(id)
        .remove()
        .then(res => {
          console.log('deleteNote', res);
          if (res?.deleted) {
            message.success('删除成功！');
            getList();
          } else {
            message.error('删除失败！');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function saveNote(values) {
    console.log('saveNote', values);
    const { _id = '', edit, _openid, success, ...resValues } = values;
    let id = _id;
    if (_id.startsWith('tmp')) {
      id = '';
    }

    if (id === '') {
      if (!loading) {
        setLoading(true);
        cloudFunc
          .getDB()
          .collection('notes')
          .add({ ...resValues, addTime: new Date() })
          .then(res => {
            if (res?.id) {
              message.success('新增成功！');
              getList();
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
        cloudFunc
          .getDB()
          .collection('notes')
          .doc(id)
          .update({ ...resValues, updateTime: new Date() })
          .then(res => {
            if (res?.updated) {
              message.success('保存成功！');
              getList();
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

  return [list, loading, getList, saveNote, deleteNote];
}

export default useNotes;
