import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Menu, message, Tooltip, Modal, Popover, Input, Spin } from 'antd';
import { connect } from 'umi';
import classnames from 'classnames';
import cloudFunc from '@/utils/cloudFunc';
import { isFuncAndRun, isEmpty, array2Tree } from '@/utils/helper';
import Article from '@/components/article/article';
import {
  CaretDownOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './index.less';

function RenderNote(props) {
  const {
    dispatch,
    loading,
    global: { showNav, currentNote = {}, currentCategory = {} },
    categoriesModel: { categories = [] },
    noteId,
    title = '',
  } = props;
  const [treeList, setTreeList] = useState([]);
  const [hideList, setHideList] = useState([]);

  function toogleMenu(e, s, isIn, len = 0) {
    if (!!len) {
      const id = s._id;
      e.stopPropagation();
      let resList = [];
      if (isIn) {
        resList = hideList.filter(s => s !== id);
      } else {
        resList = [...hideList, id];
      }
      setHideList(resList);
    } else {
      dispatch({
        type: 'global/selectArticle',
        payload: s,
      });
    }
  }

  useEffect(() => {
    if (!isEmpty(noteId)) {
      cloudFunc.getNoteData(noteId, res => {
        setTreeList(res);
      });
    }
  }, [noteId]);

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
            onClick={e => toogleMenu(e, s, inHideList, childrenLen)}
          >
            <CaretDownOutlined
              className={classnames(styles.menuIcon, {
                [styles.hidden]: !childrenLen,
                [styles.up]: inHideList,
              })}
              style={{ marginLeft: `${s.level * 15}px` }}
            />
            <div className={styles.menuTitle}>{s.title}</div>
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
        <div
          className={classnames(styles.menuItem, styles.absoluteItem)}
          style={{ width: 256 }}
        >
          <div className={styles.menuTitle}>笔记名：{title}</div>
        </div>
        {treeRender(treeList)}
      </div>
      <Article onlyView />
    </>
  );
}

export default connect(({ global, categoriesModel, loading }) => ({
  global,
  categoriesModel,
  loading: loading.models.categoriesModel,
}))(RenderNote);
