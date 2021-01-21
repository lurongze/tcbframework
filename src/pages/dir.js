import React, { useEffect, useState } from 'react';
import classname from 'classnames';
import { helper } from '@/utils';
import styles from './site.less';

function Dir(props) {
  const { dirList = [] } = props;
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (dirList) {
      const levelList = [];
      let resList = dirList.map(s => {
        const level = helper.calHeadLevel(s);
        // return level;
        levelList.push(level);
        return {
          level,
          title: s.substring(level),
        };
      });
      const minLen = Math.min(...levelList);
      resList = resList.map(s => {
        return {
          h: s.level - minLen,
          title: s.title,
        };
      });
      setList(resList);
    }
  }, [dirList]);

  return (
    <div className={styles.dirFixed}>
      {list.map(s => (
        <a
          key={s.title}
          className={classname(styles.dir, {
            [styles.active]: current === s.title,
          })}
          onClick={() => setCurrent(s.title)}
          href={`#${s.title}`}
          title={s.title}
        >
          {Array.from(new Array(s.h || 0).keys()).map(() => (
            <>&#12288;</>
          ))}
          {s.title}
        </a>
      ))}
    </div>
  );
}

export default Dir;
