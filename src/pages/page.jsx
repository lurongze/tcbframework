import React, { useState, useEffect, Fragment, useRef } from 'react';
import classnames from 'classnames';
import request from '@/utils/request';
import { history } from 'umi';
import { markdownFunc } from '@/utils/markdownit';
import {
  CaretDownOutlined,
  LayoutOutlined,
  CalculatorOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import Dir from './dir';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/lightfair.css';
import 'prismjs/themes/prism-coy.css'; // prism-coy,prism-dark,prism-funky,prism-okaidia,prism-solarizedlight,prism-tomorrow,prism-twilight,prism-coy,prism
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
// import 'highlight.js/styles/github.css';
import styles from './index.less';

const HOST = 'https://adroit-book-1253286615.cos.ap-guangzhou.myqcloud.com';

function Index(props) {
  const {
    match: {
      params: { id = '' },
    },
  } = props;
  const handle = useRef(null);
  const [hideMenu, setHideMenu] = useState(false);
  const [treeList, setTreeList] = useState([]);
  const [hideList, setHideList] = useState([]);
  const [current, setCurrent] = useState('');
  const [HTML, setHtml] = useState('');
  const [DIRLIST, setDirList] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeStamp] = useState(() => {
    return new Date().getTime();
  });

  function toogleMenu(e, s, isIn, len = 0) {
    const id = s.key;
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
      history.push(`/${id}`);
    }
  }

  function getDirData() {
    setLoading(true);
    request
      .get(`${HOST}/markdown-data/dirTree.json?rand=${timeStamp}`)
      .then(res => {
        console.log('res', res);
        setTreeList(res?.data || []);
      })
      .finally(() => setLoading(false));
  }

  function getMarkdownData(fileName) {
    if (!loading) {
      setLoading(true);
      request
        .get(`${HOST}/markdown-data/${fileName}.md?rand=${timeStamp}`)
        .then(res => {
          const { html, dirList } = markdownFunc(res?.data || '');
          setHtml(html);
          setDirList(dirList);
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    if (!loading) {
      setHideList(JSON.parse(localStorage.getItem('hideList') || '[]'));
      getDirData();
    }
    document.body.setAttribute('class', 'line-numbers');
  }, []);

  useEffect(() => {
    if (id) {
      getMarkdownData(id);
    }
  }, [id]);

  useEffect(() => {
    if (handle?.current) {
      handle.current.scrollTop = 0;
    }
  }, [HTML]);

  function treeRender(treeData) {
    return treeData.map(s => {
      const inHideList = hideList.includes(s.key);
      const children = s?.children || [];
      const childrenLen = children.length;
      const titleArr = s.title.split('.');
      let title =
        titleArr.length && typeof +titleArr[0] === 'number'
          ? titleArr[1]
          : titleArr[0];
      // title = title.replace('.md', '');
      return (
        <Fragment key={s.key}>
          <div
            className={classnames(styles.menuItem, {
              [styles.current]: id === s.key,
            })}
            title={title}
            onClick={e => toogleMenu(e, s, inHideList, childrenLen)}
          >
            <CaretDownOutlined
              className={classnames(styles.menuIcon, {
                [styles.hidden]: !childrenLen,
                [styles.up]: inHideList,
              })}
              style={{ marginLeft: `${s.level * 15}px` }}
            />
            <div className={styles.menuTitle}>{title}</div>
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
          <div className={styles.menuTitle} style={{ textAlign: 'center' }}>
            收起目录
            <LeftCircleOutlined />
          </div>
        </div>
        <div className={styles.menuItemContainer}>{treeRender(treeList)}</div>
      </div>
      <div className={styles.content} ref={handle}>
        {HTML ? (
          <div className="markdown-body">
            <div dangerouslySetInnerHTML={{ __html: HTML }} />
          </div>
        ) : (
          <div className={styles.emptyContent}>
            <CalculatorOutlined />
            暂无数据
          </div>
        )}
      </div>
      <Dir dirList={DIRLIST} />
      {loading && (
        <div className={styles.loadingContainer}>
          <LayoutOutlined />
        </div>
      )}
    </div>
  );
}

export default Index;
