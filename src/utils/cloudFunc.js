import cloudbase from '@cloudbase/js-sdk';
import { helper } from '@/utils';
import tcbEnv from '@/utils/tcbConfig';

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

let envId = tcbEnv.TCB_ENV_ID || '';
console.log('环境ID', envId);
if (!envId) {
  alert('链接错误！');
}
let app = null; // 得放到外面才行
let db = null;
let auth = null;
class cloudFunc {
  constructor() {
    // 初始化 CloudBase
    if (!app || !db || !auth) {
      app = cloudbase.init({
        env: envId,
      });
      // 初始化数据库
      db = app.database();
      auth = app.auth({
        persistence: 'local',
      });
    }
  }

  getApp() {
    return app;
  }

  getDB() {
    return db;
  }

  getAuth() {
    return auth;
  }

  async isLogin() {
    const loginState = await auth.getLoginState();
  }

  // 注册邮箱
  signUpWithEmailAndPassword(email, password, callBack, errCallback) {
    return auth
      .signUpWithEmailAndPassword(email, password)
      .then(res => {
        // 发送验证邮件成功
        helper.isFuncAndRun(callBack);
      })
      .catch(res => {
        helper.isFuncAndRun(errCallback);
      });
  }
  checkHasLogin() {
    return auth.hasLoginState();
  }
  isEmailLogin() {
    auth.getLoginState().then(res => {
      console.log('isEmailLogin', res);
    });
  }
  signOut() {
    auth.signOut();
  }
  // 邮箱登录
  signInWithEmailAndPassword(email, password, callBack, errCallback) {
    if (!auth.hasLoginState()) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          helper.isFuncAndRun(callBack);
        })
        .catch(res => {
          helper.isFuncAndRun(errCallback);
        });
    } else {
      helper.isFuncAndRun(callBack);
    }
  }
  // 重置邮箱登录密码
  sendPasswordResetEmail(email, callBack, errCallback) {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        // 发送重置密码邮件成功
        helper.isFuncAndRun(callBack);
      })
      .catch(res => {
        helper.isFuncAndRun(errCallback);
      });
  }

  // 匿名登录
  signIn(callBack) {
    if (!auth.hasLoginState()) {
      auth
        .anonymousAuthProvider()
        .signIn()
        .catch(res => {
          message.error('请确认开启了匿名登录！');
        })
        .then(() => {
          helper.isFuncAndRun(callBack);
        });
    } else {
      helper.isFuncAndRun(callBack);
    }
  }

  uploadPicture(cloudPath, filePath) {
    return app.uploadFile({
      cloudPath,
      filePath,
      // 云存储的路径
      // cloudPath: 'dirname/filename',
      // 需要上传的文件，File 类型
      // filePath: document.getElementById('file').files[0],
    });
    // .then(res => {
    //   // 返回文件 ID
    // });
  }

  deleteFile(fileID) {
    return app.deleteFile({
      fileList: [fileID],
    });
  }

  getPictureURL(fileID) {
    return app
      .getTempFileURL({
        fileList: [fileID],
      })
      .then(res => {
        if (res?.fileList && res.fileList.length) {
          const resItem = res.fileList[0];
          if (resItem.code === 'SUCCESS') {
            return { url: resItem.download_url, fileID: resItem.fileID };
          }
        }
        return { url: '', fileID: '' };
        // res.fileList.forEach(el => {
        //   if (el.code === 'SUCCESS') {
        //     console.log(el.tempFileURL);
        //   } else {
        //     //获取下载链接失败
        //   }
        // });
      });
  }

  savePicture(values) {
    return db.collection('pictures').add({ ...values, uploadTime: new Date() });
  }

  deletePicture(id) {
    return db
      .collection('pictures')
      .doc(id)
      .remove();
  }

  queryPicture(values) {
    return db
      .collection('pictures')
      .orderBy('uploadTime', 'desc')
      .limit(200)
      .get();
  }

  queryNotes() {
    return db
      .collection('notes')
      .orderBy('sort', 'asc')
      .limit(100)
      .get();
  }

  saveNote(values) {
    const { _id = '', edit, _openid, success, ...resValues } = values;
    let id = _id;
    if (_id.startsWith('tmp')) {
      id = '';
    }

    if (id === '') {
      return db.collection('notes').add({ ...resValues, addTime: new Date() });
    }
    return db
      .collection('notes')
      .doc(id)
      .update({ ...resValues, updateTime: new Date() });
  }

  deleteNote(id) {
    return db
      .collection('notes')
      .doc(id)
      .remove();
  }

  queryCategories(noteId) {
    return db
      .collection('categories')
      .where({ noteId })
      .orderBy('sort', 'asc')
      .limit(1000)
      .get();
  }

  saveCategory(values) {
    const { _id = '', edit, _openid, success, ...resValues } = values;
    let id = _id;
    if (_id.startsWith('tmp')) {
      id = '';
    }

    if (id === '') {
      return db
        .collection('categories')
        .add({ ...resValues, addTime: new Date() });
    }
    return db
      .collection('categories')
      .doc(id)
      .update({ ...resValues, updateTime: new Date() });
  }

  deleteCategory(id) {
    return db
      .collection('categories')
      .doc(id)
      .remove();
  }

  queryArticles(params) {
    return db
      .collection('article')
      .where(params)
      .orderBy('sort', 'asc')
      .limit(1000)
      .get();
  }

  saveArticle(values) {
    const { _id = '', edit, _openid, success, ...resValues } = values;
    let id = _id;
    if (_id.startsWith('tmp')) {
      id = '';
    }

    if (id === '') {
      return db
        .collection('article')
        .add({ ...resValues, addTime: new Date() });
    }
    return db
      .collection('article')
      .doc(id)
      .update({ ...resValues, updateTime: new Date() });
  }

  deleteArticles(id) {
    return db
      .collection('article')
      .doc(id)
      .remove();
  }

  getArticleContent(values) {
    return db
      .collection('articleContent')
      .where(values)
      .limit(1)
      .get();
  }

  addArticleContent(values) {
    return db
      .collection('articleContent')
      .add({ ...values, addTime: new Date() });
  }

  updateArticleContent(values) {
    const { articleId, content, html, dirList } = values;
    return db
      .collection('articleContent')
      .where({ articleId })
      .update({
        content,
        // html, // 这个先不保存吧，太大了
        dirList,
        updateTime: new Date(),
      });
  }

  getNoteData(noteId, cb) {
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
    Promise.all([categoryPromise, articlesPromise]).then(res => {
      const cateList = res[0]?.data || [];
      const atList = (res[1]?.data || []).map(s => ({
        ...s,
        parentId: s.cateId,
      }));
      const resList = helper.array2Tree([...cateList, ...atList], '');
      helper.isFuncAndRun(cb, resList);
    });
  }
}

export default new cloudFunc();
