import React, { useEffect, useState } from 'react';
import { helper } from '@/utils';
import cloudFunc from '@/utils/cloudFunc';
import { message } from 'antd';

const db = cloudFunc.getDB();
function useSite(id) {
  const [treeList, setTreeList] = useState([]);
  const [record, setRecord] = useState({ content: '' });
  const [loading, setLoading] = useState(false);

  function getList(noteId) {
    if (!loading) {
      setLoading(true);
      const categoryPromise = db
        .collection('categories')
        .where({ noteId })
        .orderBy('sort', 'asc')
        .limit(1000)
        .get();
      const articlesPromise = db
        .collection('article')
        .where({ noteId })
        .orderBy('sort', 'asc')
        .limit(1000)
        .get();
      Promise.all([categoryPromise, articlesPromise])
        .then(res => {
          const cateList = res[0]?.data || [];
          const atList = (res[1]?.data || []).map(s => ({
            ...s,
            parentId: s.cateId,
          }));
          const resList = helper.array2Tree([...cateList, ...atList], '');
          console.log('resList', resList);
          setTreeList(resList);
        })
        .finally(() => setLoading(false));
    }
  }

  function getRecord(articleId = '') {
    if (!loading && articleId.length && articleId !== 'empty') {
      setLoading(true);
      cloudFunc.signIn(() => {
        db.collection('articleContent')
          .where({ articleId })
          .limit(1)
          .get()
          .then(res => {
            if (res?.data && res.data.length > 0) {
              setRecord(res.data[0]);
            } else {
              setRecord({ content: '' });
            }
          })
          .finally(() => setLoading(false));
      });
    }
  }

  useEffect(() => {
    cloudFunc.signIn(() => {
      getList(id);
    });
  }, []);

  return [treeList, loading, record, getRecord];
}

export default useSite;
