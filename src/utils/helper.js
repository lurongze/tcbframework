// 需要插入父节点id，pid为null或''，就是找root节点，然后root节点再去找自己的子节点
import dayjs from 'dayjs';

class helper {
  static array2Tree(data, pid, level = 0) {
    let res = [];
    data.forEach(item => {
      if (item.parentId === pid) {
        let itemChildren = helper.array2Tree(data, item._id, level + 1);
        if (itemChildren.length) {
          item.children = itemChildren;
        }
        res.push({ ...item, level });
      }
    });
    return res;
  }

  static isEmpty(val) {
    if (
      val === null ||
      typeof val === 'undefined' ||
      (typeof val === 'string' && val === '' && val !== 'undefined')
    ) {
      return true;
    }
    return false;
  }

  static isFuncAndRun(func, ...params) {
    if (!helper.isEmpty(func) && typeof func === 'function') {
      func(...params);
    }
  }

  static log(...params) {
    console.log(...params);
  }

  static getExtens(file) {
    const tmp = file.split('.');
    return tmp[tmp.length - 1];
  }

  static createPictureUrl(file) {
    const name = file.name;
    const ext = helper.getExtens(name);
    return `${dayjs().format('YYYYMMDDHHmmss')}.${ext}`;
  }

  static calHeadLevel(str) {
    const tmpArr = str.split('');
    const len = tmpArr.length;
    let res = 0;
    for (let i = 0; i < len; i++) {
      if (tmpArr[i] !== '#') {
        res = i;
        break;
      }
    }
    return res;
  }

  static getTreeList() {
    const list = [
      { id: 1, title: 'html5', parentId: 0 },
      { id: 2, title: 'javascript', parentId: 0 },
      { id: 3, title: 'css', parentId: 0 },
      { id: 4, title: '标签学习', parentId: 1 },
      { id: 5, title: 'header学习', parentId: 1 },
      { id: 6, title: 'flex布局', parentId: 3 },
      { id: 7, title: 'react', parentId: 2 },
      { id: 8, title: 'vue', parentId: 2 },
      { id: 9, title: 'angular', parentId: 2 },
      { id: 10, title: 'loadash', parentId: 2 },
      { id: 11, title: 'webpack', parentId: 2 },
    ];
    return array2Tree(list, 0);
  }
}

export default helper;
