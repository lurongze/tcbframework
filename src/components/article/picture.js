import React, { useState, useEffect, cloneElement } from 'react';
import { Button, Drawer, message, Upload, Tooltip, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createPictureUrl } from '@/utils/helper';
import cloudFunc from '@/utils/cloudFunc';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ImgCrop from 'antd-img-crop';
import classnames from 'classnames';

import styles from './index.less';

function Picture(props) {
  const { dispatch, children } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  function deletePicture(s) {
    setLoading(true);
    Promise.all([
      cloudFunc.deleteFile(s.fileID),
      cloudFunc.deletePicture(s._id),
    ]).then(() => {
      setLoading(false);
      setList(list.filter(ss => ss._id !== s._id));
    });
  }

  const uploadProps = {
    name: 'file',
    beforeUpload: file => {
      setLoading(true);
      const cloudPath = createPictureUrl(file);
      cloudFunc
        .uploadPicture(cloudPath, file)
        .then(res => {
          if (res?.fileID) {
            cloudFunc
              .getPictureURL(res.fileID)
              .then(res1 => {
                if (res1?.url && res1?.fileID) {
                  cloudFunc.savePicture(res1).then(res2 => {
                    message.success('上传成功！');
                    setLoading(false);
                    setList([{ url: res1.url }, ...list]);
                  });
                } else {
                  setLoading(false);
                }
              })
              .catch(() => setLoading(false));
          }
        })
        .catch(() => setLoading(false));
      return false;
    },
  };

  useEffect(() => {
    cloudFunc.queryPicture().then(res => {
      setList(res.data);
    });
  }, []);

  function renderTitle(s) {
    return (
      <>
        <div
          onClick={() => {
            window.open(s.url);
          }}
          className="toopTitleItem"
        >
          查看原图
        </div>
        <CopyToClipboard
          text={`![alt 属性文本](${s.url})`}
          onCopy={() => message.success('复制成功！')}
        >
          <div className="toopTitleItem">复制Markdown链接</div>
        </CopyToClipboard>

        <div onClick={() => deletePicture(s)} className="toopTitleItem">
          删除
        </div>
      </>
    );
  }

  return (
    <>
      {cloneElement(children, {
        onClick() {
          setVisible(true);
        },
      })}
      <Drawer
        width="40vw"
        visible={visible}
        handler={null}
        closable={null}
        onClose={() => setVisible(false)}
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={loading}>
          <div className={styles.pictureBlock}>
            {list.map(s => (
              <Tooltip key={s._id} title={renderTitle(s)}>
                <img className={styles.pictureItem} src={s.url} />
              </Tooltip>
            ))}
          </div>
        </Spin>

        <div className={styles.footer}>
          <ImgCrop
            quality={1}
            rotate
            modalTitle="图片处理"
            modalOk="确定"
            modalCancel="取消"
          >
            <Upload {...uploadProps}>
              <Button
                className={styles.button}
                type="primary"
                icon={<UploadOutlined />}
              >
                裁剪上传
              </Button>
            </Upload>
          </ImgCrop>
          <Upload {...uploadProps}>
            <Button
              className={styles.button}
              type="primary"
              icon={<UploadOutlined />}
            >
              原图上传
            </Button>
          </Upload>
          <Button onClick={() => setVisible(false)} className={styles.button}>
            取消
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default Picture;
