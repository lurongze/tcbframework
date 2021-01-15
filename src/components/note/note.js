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
  AccountBookTwoTone,
  BookOutlined,
} from '@ant-design/icons';
import styles from '../categories/index.less';

let timer = null;
function Note(props) {
  const {
    dispatch,
    noteModel: { notes = [] },
    global: { currentNote = {} },
    loading,
  } = props;
  const csRef = useRef(null);
  const [showNotes, setShowNotes] = useState(true);
  const [eidtId, setEditId] = useState('');
  const [list, setList] = useState([]);

  function selectNote(data) {
    dispatch({
      type: 'global/selectNote',
      payload: data,
    });
    dispatch({
      type: 'articleModel/save',
      payload: { articles: [], articleCotent: '' },
    });
    localStorage.setItem('currentNote', JSON.stringify(data));
    setShowNotes(false);
  }

  function addNote() {
    const emp = list.find(s => isEmpty(s.title));
    if (!emp) {
      const newId = `tmp${new Date().getTime()}`;
      const resList = [
        ...list,
        {
          _id: newId,
          title: '',
          sort: list[list.length - 1]?.sort || 50,
          edit: true,
        },
      ];
      setEditId(newId);
      setList(resList);
    }
  }

  function removeNote(s) {
    Modal.confirm({
      title: '确认删除笔记吗？',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'noteModel/deleteNote',
          payload: {
            id: s._id,
            success: () => {
              message.success('删除成功！');
              dispatch({
                type: 'noteModel/queryNotes',
              });
            },
          },
        });
      },
    });
  }

  function saveNote(e, row) {
    const title = e.target.value;
    if (!isEmpty(title)) {
      setEditId('');
      dispatch({
        type: 'noteModel/saveNote',
        payload: {
          ...row,
          title,
          success: () => {
            message.success('保存成功！');
            dispatch({
              type: 'noteModel/queryNotes',
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
      selectNote(s);
    }, 200);
  }

  function hanldDbClick(id) {
    timer && clearTimeout(timer);
    setEditId(id);
  }

  function changeSort(s) {
    if (csRef?.current) {
      csRef.current.showModal(s);
    }
  }

  function goWebSite(s) {
    window.open(`/note/${s._id}/${s.title}`);
  }

  useEffect(() => {
    dispatch({
      type: 'noteModel/queryNotes',
    });
  }, []);

  useEffect(() => {
    if (notes.length) {
      setList(notes);
      const getStr = localStorage.getItem('currentNote') || '';
      if (isEmpty(getStr)) {
        // 没有，就是第一个
        selectNote(notes[0]);
      } else {
        try {
          const data = JSON.parse(getStr); // 解析成功
          selectNote(data);
        } catch (error) {
          // 解析错误
          selectNote(notes[0]);
        }
      }
    }
  }, [notes]);

  function renderTitle(s) {
    return (
      <>
        <div onClick={() => setEditId(s._id)} className="toopTitleItem">
          <EditOutlined />
          编辑
        </div>
        <div onClick={() => changeSort(s)} className="toopTitleItem">
          <EditOutlined />
          修改排序
        </div>
        <div onClick={() => goWebSite(s)} className="toopTitleItem">
          <EditOutlined />
          专注模式
        </div>
        <div
          onClick={() => {
            removeNote(s);
          }}
          className="toopTitleItem"
        >
          <DeleteOutlined />
          删除
        </div>
      </>
    );
  }

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.menuComponent}>
          <div className={classnames(styles.menuItem, styles.absoluteItem)}>
            <div
              onClick={() => {
                addNote();
              }}
              className={styles.menuTitle}
            >
              <PlusOutlined style={{ margin: '0 5px' }} />
              新增笔记
            </div>
          </div>
          {list.map(s => (
            <div
              key={s._id}
              className={classnames(styles.menuItem, {
                [styles.current]: s._id === currentNote._id,
              })}
              title={`[${s.sort}]${s.title}`}
            >
              {eidtId === s._id ? (
                <div className={styles.menuTitle}>
                  <Input
                    defaultValue={s.title}
                    autoFocus
                    onBlur={() => handleBlur()}
                    onPressEnter={e => saveNote(e, s)}
                  />
                </div>
              ) : (
                <div
                  className={styles.menuTitle}
                  onClick={() => handleClick(s)}
                  onDoubleClick={() => hanldDbClick(s._id)}
                >
                  <BookOutlined style={{ margin: '0 5px' }} />
                  {s.title}
                </div>
              )}
              <Tooltip placement="right" title={renderTitle(s)}>
                <MoreOutlined className={styles.menuIcon} />
              </Tooltip>
            </div>
          ))}
        </div>
      </Spin>
      <ChangeSort
        ref={csRef}
        onSave={values => {
          dispatch({
            type: 'noteModel/saveNote',
            payload: {
              ...values,
              success: () => {
                message.success('保存成功！');
                dispatch({
                  type: 'noteModel/queryNotes',
                });
              },
            },
          });
        }}
      />
    </>
  );
}

export default connect(({ global, noteModel, loading }) => ({
  global,
  noteModel,
  loading: loading.models.noteModel,
}))(Note);
