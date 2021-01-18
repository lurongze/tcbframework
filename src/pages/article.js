import React, { useState, useEffect } from 'react';
import { Button, Result, Avatar, Tag, Input, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import ArticleForm from '@/components/article/form';
import useArticle from '@/hooks/useArticle';
function Category(props) {
  const {
    match: {
      params: { cateId = '', noteId = '', title = '' },
    },
  } = props;
  const [list, loading, getList, _, deleteRecord] = useArticle();
  useEffect(() => {
    if (cateId.length) {
      getList(cateId);
    }
  }, [cateId]);

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      width: '30%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: '15%',
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      valueType: 'dateTime',
      editable: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      editable: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <ArticleForm
          trigger={<a>编辑</a>}
          title="编辑分类"
          record={record}
          onSuccess={() => {
            getList(cateId);
          }}
        />,
        <a
          key="editContent"
          onClick={() =>
            history.push(`/articleContent/${record._id}/${record.title}`)
          }
        >
          编辑内容
        </a>,
        <Popconfirm
          title="确认删除？"
          okText="删除"
          cancelText="取消"
          onConfirm={() => {
            deleteRecord(record._id, record.cateId);
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      rowKey="_id"
      headerTitle={
        <span>
          分类文章管理: <b>{title}</b>
        </span>
      }
      loading={loading}
      columns={columns}
      dataSource={list}
      pagination={false}
      options={false}
      search={false}
      toolBarRender={() => [
        <ArticleForm
          trigger={<Button type="primary">新增文章</Button>}
          title="新增文章"
          record={{
            sort: 50,
            parentId: '',
            level: 0,
            cateId,
          }}
          onSuccess={() => {
            getList(cateId);
          }}
        />,
        <Button onClick={() => history.goBack()}>返回</Button>,
      ]}
    />
  );
}

export default Category;
