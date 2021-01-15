import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Menu, message, Tooltip, Modal, Popover, Input, Spin } from 'antd';
import { connect } from 'umi';
import classnames from 'classnames';
import { isFuncAndRun, isEmpty, array2Tree } from '@/utils/helper';
import ChangeSort from '@/components/changeSort/changeSort';
import {
  CaretDownOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './index.less';

let timer = null;
function Categories(props) {
  const {
    dispatch,
    loading,
    global: { showNav, currentNote = {}, currentCategory = {} },
    categoriesModel: { categories = [] },
  } = props;
  const csRef = useRef(null);
  const [treeList, setTreeList] = useState([]);
  const [hideList, setHideList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [editId, setEditId] = useState('');

  function storeAndSetList(resList = []) {
    const resTree = array2Tree(resList, '');
    const resStoreList = resList.map(s => ({ ...s, children: undefined }));
    setStoreList(resStoreList);
    setTreeList(resTree);
  }

  function addRow(parentId = '') {
    if (currentNote?._id) {
      const _id = `tmp${new Date().getTime()}`;
      const resList = [
        ...storeList,
        {
          _id,
          title: '',
          parentId,
          noteId: currentNote._id,
          sort: 50,
        },
      ];
      setEditId(_id);
      storeAndSetList(resList);
    } else {
      message.error('未选择笔记！');
    }
  }

  function handleBlur() {
    setEditId('');
    const resList = storeList.filter(s => !isEmpty(s.title));
    storeAndSetList(resList);
  }

  function saveCategory(e, row) {
    const title = e.target.value;
    if (!isEmpty(title)) {
      setEditId('');
      dispatch({
        type: 'categoriesModel/saveCategory',
        payload: {
          ...row,
          title,
          success: () => {
            message.success('保存成功！');
            dispatch({
              type: 'categoriesModel/queryCategories',
              payload: currentNote._id,
            });
          },
        },
      });
    }
  }

  function toogleMenu(e, id, isIn, len = 0) {
    if (!!len) {
      e.stopPropagation();
      let resList = [];
      if (isIn) {
        resList = hideList.filter(s => s !== id);
      } else {
        resList = [...hideList, id];
      }
      setHideList(resList);
    }
  }

  function hanldeClick(s) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      // setCurrentCate(s._id);
      dispatch({
        type: 'global/selectCategory',
        payload: s,
      });
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

  function removeCategory(s) {
    const { _id, children = [] } = s;
    if (children.length) {
      message.error('分类下还有子分类，无法删除');
    } else {
      Modal.confirm({
        title: '确认删除分类吗？',
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'categoriesModel/deleteCategory',
            payload: {
              id: _id,
              success: () => {
                message.success('删除成功！');
                dispatch({
                  type: 'categoriesModel/queryCategories',
                  payload: currentNote._id,
                });
              },
            },
          });
        },
      });
    }
  }

  useEffect(() => {
    if (currentNote?._id) {
      dispatch({
        type: 'categoriesModel/queryCategories',
        payload: currentNote._id,
      });
    }
  }, [currentNote]);

  useEffect(() => {
    storeAndSetList(categories);
  }, [categories]);

  function renderTitle(s) {
    return (
      <>
        <div className="toopTitleItem" onClick={() => setEditId(s._id)}>
          <EditOutlined />
          编辑
        </div>
        <div className="toopTitleItem" onClick={() => addRow(s._id)}>
          <PlusOutlined />
          新增下级
        </div>
        <div className="toopTitleItem" onClick={() => changeSort(s)}>
          <PlusOutlined />
          修改排序
        </div>
        <div className="toopTitleItem" onClick={() => removeCategory(s)}>
          <DeleteOutlined />
          删除
        </div>
      </>
    );
  }

  function treeRender(treeData) {
    return treeData.map(s => {
      const inHideList = hideList.includes(s._id);
      const children = s?.children || [];
      const childrenLen = children.length;
      return (
        <Fragment key={s._id}>
          <div
            className={classnames(styles.menuItem, {
              [styles.current]:
                currentCategory?._id && s._id === currentCategory._id,
            })}
            title={`[${s.sort}]${s.title}`}
          >
            {editId === s._id ? (
              <div className={styles.menuTitle}>
                <Input
                  defaultValue={s.title}
                  autoFocus
                  onBlur={() => handleBlur()}
                  onPressEnter={e => saveCategory(e, s)}
                />
              </div>
            ) : (
              <>
                <CaretDownOutlined
                  onClick={e => toogleMenu(e, s._id, inHideList, childrenLen)}
                  className={classnames(styles.menuIcon, {
                    [styles.hidden]: !childrenLen,
                    [styles.up]: inHideList,
                  })}
                  style={{ marginLeft: `${s.level * 15}px` }}
                />
                <div
                  className={styles.menuTitle}
                  onClick={() => hanldeClick(s)}
                  onDoubleClick={() => hanldDbClick(s._id)}
                >
                  {s.title}
                </div>
              </>
            )}
            <Tooltip placement="right" title={renderTitle(s)}>
              <MoreOutlined
                className={styles.menuIcon}
                style={{ margin: '0 5px' }}
              />
            </Tooltip>
          </div>
          <div
            className={classnames(styles.subMenu, {
              [styles.hidden]: inHideList,
            })}
          >
            {treeRender(children)}
          </div>
        </Fragment>
      );
    });
  }

  return (
    <>
      <div className={styles.menuComponent}>
        <div className={classnames(styles.menuItem, styles.absoluteItem)}>
          <div className={styles.menuTitle} onClick={() => addRow('')}>
            <PlusOutlined style={{ margin: '0 5px' }} />
            新增分类
          </div>
        </div>
        <Spin spinning={loading}>
          {treeRender(treeList)}
          {treeList.length === 0 && (
            <div className={styles.menuItem} style={{ visibility: 'hidden' }}>
              VISIBLE HIDDEN
            </div>
          )}
        </Spin>
      </div>
      <ChangeSort
        ref={csRef}
        onSave={values => {
          dispatch({
            type: 'categoriesModel/saveCategory',
            payload: {
              ...values,
              success: () => {
                message.success('保存成功！');
                dispatch({
                  type: 'categoriesModel/queryCategories',
                  payload: currentNote._id,
                });
              },
            },
          });
        }}
      />
    </>
  );
}

export default connect(({ global, categoriesModel, loading }) => ({
  global,
  categoriesModel,
  loading: loading.models.categoriesModel,
}))(Categories);
