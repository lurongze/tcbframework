import React, { useEffect, useState, useRef } from 'react';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import { Input, message, Modal, Popover, Tooltip, Spin } from 'antd';
import ChangeSort from '@/components/changeSort/changeSort';
import { connect } from 'umi';
import classnames from 'classnames';
import {
  CaretDownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
  BookOutlined,
} from '@ant-design/icons';
import styles from '../categories/index.less';

let timer = null;
function Articles(props) {
  const {
    dispatch,
    articleModel: { articles = [] },
    global: { currentNote = {}, currentCategory = {}, currentArticle = {} },
    loading = false,
  } = props;
  const csRef = useRef(null);
  const [eidtId, setEditId] = useState('');
  const [list, setList] = useState([]);

  function selectArticle(data) {
    dispatch({
      type: 'global/selectArticle',
      payload: data,
    });
  }
  function changeSort(s) {
    if (csRef?.current) {
      csRef.current.showModal(s);
    }
  }
  function addArticle() {
    if (isEmpty(currentCategory?._id) || isEmpty(currentNote?._id)) {
      message.error('未选择笔记本或者分类！');
    } else {
      const emp = list.find(s => isEmpty(s.title));
      if (!emp) {
        const newId = `tmp${new Date().getTime()}`;
        const resList = [
          ...list,
          {
            _id: newId,
            title: '',
            cateId: currentCategory._id,
            noteId: currentNote._id,
            sort: list[list.length - 1]?.sort || 50,
          },
        ];
        setEditId(newId);
        setList(resList);
      }
    }
  }

  function removeArticle(s) {
    Modal.confirm({
      title: '确认删除文章吗？',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'articleModel/deleteArticle',
          payload: {
            id: s._id,
            success: () => {
              message.success('删除成功！');
              dispatch({
                type: 'articleModel/queryArticles',
                payload: {
                  cateId: currentCategory._id,
                },
              });
            },
          },
        });
      },
    });
  }

  function saveArticle(e, row) {
    const title = e.target.value;
    if (!isEmpty(title)) {
      setEditId('');
      dispatch({
        type: 'articleModel/saveArticle',
        payload: {
          ...row,
          title,
          success: () => {
            message.success('保存成功！');
            dispatch({
              type: 'articleModel/queryArticles',
              payload: {
                cateId: currentCategory._id,
              },
            });
          },
        },
      });
    }
  }

  function handleBlur() {
    setEditId('');
    setList(list.filter(s => !isEmpty(s.title)));
  }

  function handleClick(s) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      selectArticle(s);
    }, 200);
  }

  function hanldDbClick(id) {
    timer && clearTimeout(timer);
    setEditId(id);
  }

  useEffect(() => {
    if (!isEmpty(currentCategory?._id)) {
      dispatch({
        type: 'articleModel/queryArticles',
        payload: {
          cateId: currentCategory._id,
        },
      });
    }else{
      dispatch({
        type: 'articleModel/save',
        payload: {
          articles: [],
          articleContent: ''
        },
      });
    }
  }, [currentCategory]);

  useEffect(() => {
    setList(articles);
  }, [articles]);

  function renderTitle(s) {
    return (
      <>
        <div className="toopTitleItem" onClick={() => setEditId(s._id)}>
          <EditOutlined />
          编辑
        </div>
        <div onClick={() => changeSort(s)} className="toopTitleItem">
          <EditOutlined />
          修改排序
        </div>
        <div
          className="toopTitleItem"
          onClick={() => {
            removeArticle(s);
          }}
        >
          <DeleteOutlined />
          删除
        </div>
      </>
    );
  }

  return (
    <div className={classnames(styles.menuComponent, styles.articleBlock)}>
      <div className={classnames(styles.menuItem, styles.absoluteItem)}>
        <div
          onClick={() => {
            addArticle();
          }}
          className={styles.menuTitle}
        >
          <PlusOutlined style={{ margin: '0 5px' }} />
          新增文章
        </div>
      </div>
      <Spin spinning={loading}>
        {list.map(s => (
          <div
            key={s._id}
            className={classnames(styles.menuItem, {
              [styles.current]: s._id === currentArticle._id,
            })}
            title={`[${s.sort}]${s.title}`}
          >
            {eidtId === s._id ? (
              <div className={styles.menuTitle}>
                <Input
                  defaultValue={s.title}
                  autoFocus
                  onBlur={() => handleBlur()}
                  onPressEnter={e => saveArticle(e, s)}
                />
              </div>
            ) : (
              <div
                className={styles.menuTitle}
                onClick={() => handleClick(s)}
                onDoubleClick={() => hanldDbClick(s._id)}
              >
                <FileTextOutlined style={{ margin: '0 5px' }} />
                {s.title}
              </div>
            )}
            <Tooltip placement="right" title={renderTitle(s)}>
              <MoreOutlined className={styles.menuIcon} />
            </Tooltip>
          </div>
        ))}
        {list.length === 0 && (
          <div className={styles.menuItem} style={{ visibility: 'hidden' }}>
            VISIBLE HIDDEN
          </div>
        )}
      </Spin>
      <ChangeSort
        ref={csRef}
        onSave={values => {
          dispatch({
            type: 'articleModel/saveArticle',
            payload: {
              ...values,
              success: () => {
                message.success('保存成功！');
                dispatch({
                  type: 'articleModel/queryArticles',
                  payload: {
                    cateId: currentCategory._id,
                  },
                });
              },
            },
          });
        }}
      />
    </div>
  );
}

export default connect(({ global, articleModel, loading }) => ({
  global,
  articleModel,
  loading:
    loading.effects['articleModel/deleteArticle'] ||
    loading.effects['articleModel/queryArticles'] ||
    loading.effects['articleModel/saveArticle'],
}))(Articles);
