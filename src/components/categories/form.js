import React, { useEffect } from 'react';
import { Button, message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import helper from '@/utils/helper';
import useCategory from '@/hooks/useCategory';

export default props => {
  const {
    title = '新建表单',
    record = {},
    onSuccess,
    trigger = (
      <Button type="primary">
        <PlusOutlined />
        新建表单
      </Button>
    ),
  } = props;
  const [form] = Form.useForm();
  const [_, loading, _1, saveRecord] = useCategory();

  useEffect(() => {
    form.setFieldsValue(record);
  }, [record]);
  return (
    <ModalForm
      form={form}
      title={title}
      trigger={trigger}
      width="30vw"
      loading={loading}
      modalProps={{
        onCancel: () => console.log('run'),
        okText: '保存',
      }}
      onFinish={async values => {
        await saveRecord({
          ...record,
          ...values,
        });
        helper.isFuncAndRun(onSuccess);
        return true;
      }}
    >
      <ProFormText
        name="title"
        label="分类名称"
        placeholder="请输入分类名称"
        required
        labelCol={{ span: 4 }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        required
        width="sm"
        placeholder="请输入排序"
        labelCol={{ span: 4 }}
      />
    </ModalForm>
  );
};
