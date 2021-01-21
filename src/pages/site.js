import React, { useState, useEffect, Fragment, useRef } from 'react';
import classnames from 'classnames';
import request from '@/utils/request';
import { history } from 'umi';
import { Empty } from 'antd';
import {
  CaretDownOutlined,
  LayoutOutlined,
  CalculatorOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import { markdownFunc } from '@/utils/markdownit';
import cloudFunc from '@/utils/cloudFunc';
import useSite from '@/hooks/useSite';
import Dir from './dir';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/lightfair.css';
import 'prismjs/themes/prism-coy.css'; // prism-coy,prism-dark,prism-funky,prism-okaidia,prism-solarizedlight,prism-tomorrow,prism-twilight,prism-coy,prism
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import styles from './site.less';

function Site(props) {
  const {
    match: {
      params: { id = '', noteId = '', title = '' },
    },
  } = props;
  const handle = useRef(null);
  const [hideMenu, setHideMenu] = useState(false);
  const [hideList, setHideList] = useState([]);
  const [DIRLIST, setDirList] = useState('');
  const [HTML, setHTML] = useState('');
  const [treeList, loading, record, getRecord] = useSite(noteId);

  function toogleMenu(e, s, isIn, len = 0) {
    const id = s._id;
    if (!!len) {
      e.stopPropagation();
      let resList = [];
      if (isIn) {
        resList = hideList.filter(s => s !== id);
      } else {
        resList = [...hideList, id];
      }
      setHideList(resList);
      localStorage.setItem('hideList', JSON.stringify(resList));
    } else {
      history.push(`/site/${noteId}/${id}/${title}`);
    }
  }

  useEffect(() => {
    if (handle?.current) {
      handle.current.scrollTop = 0;
    }
  }, [HTML]);

  useEffect(() => {
    const res = markdownFunc(record.content || '');
    setHTML(res?.html || '');
    setDirList(res?.dirList || []);
  }, [record]);

  useEffect(() => {
    getRecord(id);
  }, [id]);

  function treeRender(treeData) {
    return treeData.map(s => {
      const inHideList = hideList.includes(s._id);
      const children = s?.children || [];
      const childrenLen = children.length;
      return (
        <Fragment key={s._id}>
          <div
            className={classnames(styles.menuItem, {
              [styles.current]: id === s._id,
            })}
            title={s.title}
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
              [styles.hidden]: !inHideList,
            })}
          >
            {treeRender(children)}
          </div>
        </Fragment>
      );
    });
  }

  return (
    <div className={styles.body}>
      {hideMenu && (
        <div
          title="打开目录"
          className={styles.openMenu}
          onClick={() => setHideMenu(false)}
        >
          <RightCircleOutlined />
        </div>
      )}
      <div
        className={classnames(styles.menuComponent, {
          [styles.hideMenu]: hideMenu,
        })}
      >
        <div
          className={classnames(styles.menuItem, styles.absoluteItem)}
          onClick={() => setHideMenu(true)}
        >
          <div
            className={styles.menuTitle}
            title={decodeURIComponent(title)}
            style={{ flex: 1, fontWeight: 600 }}
          >
            {decodeURIComponent(title)}
          </div>
          <div
            className={styles.menuTitle}
            style={{ width: '60px', textAlign: 'center' }}
          >
            收起
            <LeftCircleOutlined />
          </div>
        </div>
        <div className={styles.menuItemContainer}>{treeRender(treeList)}</div>
      </div>
      <div className={styles.content} ref={handle}>
        {HTML && !loading && (
          <div className="markdown-body">
            <div dangerouslySetInnerHTML={{ __html: HTML }} />
          </div>
        )}
        {!HTML && !loading && (
          <div className={styles.emptyContent}>
            <Empty
              description="暂无数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
        {loading && (
          <div className={styles.emptyContent}>
            <Empty
              description="数据加载中..."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>
      <Dir dirList={DIRLIST} />
    </div>
  );
}

export default Site;
