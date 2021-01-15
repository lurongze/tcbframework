import React, {
  useEffect,
  useState,
  cloneElement,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Form,
  Card,
  message,
  Empty,
  Button,
  Input,
  Modal,
  notification,
  InputNumber,
} from 'antd';

import MainBar from '@/components/mainBar/mainBar';
import Categories from '@/components/categories/categories';
import { connect } from 'umi';
import { isFuncAndRun } from '@/utils/helper';
import cloudFunc from '@/utils/cloudFunc';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

function ChangeSort(props, ref) {
  const { onLoginSuccess, onSave } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({});

  useImperativeHandle(
    ref,
    () => ({
      showModal(vals) {
        setVisible(true);
        setValues(vals);
        form.setFieldsValue(vals);
      },
    }),
    [],
  );

  return (
    <>
      <Modal
        width="40vw"
        visible={visible}
        onCancel={() => setVisible(false)}
        forceRender
        okText="保存"
        title="修改排序"
        cancelText="取消"
        onOk={() => form.submit()}
      >
        <Form
          {...layout}
          form={form}
          name="registerForm"
          onFinish={vals => {
            isFuncAndRun(onSave, { ...values, ...vals });
            setVisible(false);
          }}
        >
          <Form.Item label="标题" name="title">
            <Input readOnly disabled />
          </Form.Item>

          <Form.Item
            label="排序"
            name="sort"
            rules={[
              {
                required: true,
                message: '请输入排序！',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default forwardRef(ChangeSort);
