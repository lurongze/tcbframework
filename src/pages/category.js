import React, { useEffect } from 'react';
import { Button, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import CategoryForm from '@/components/categories/form';
import useCategory from '@/hooks/useCategory';
function Category(props) {
  const {
    match: {
      params: { noteId = '', title = '' },
    },
  } = props;
  const [list, loading, getList, _, deleteRecord] = useCategory();
  useEffect(() => {
    if (noteId.length) {
      getList(noteId);
    }
  }, [noteId]);

  const columns = [
    {
      title: '分类名称',
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
      width: 250,
      render: (text, record) => [
        <CategoryForm
          trigger={<a>编辑</a>}
          title="编辑分类"
          record={record}
          onSuccess={() => {
            getList(noteId);
          }}
        />,
        <CategoryForm
          trigger={<a>新增下级</a>}
          title={`新增[${record.title}]下级`}
          record={{
            sort: 50,
            parentId: record._id,
            level: +record.level + 1,
            noteId,
          }}
          onSuccess={() => {
            getList(noteId);
          }}
        />,
        <a
          key="article"
          onClick={() =>
            history.push(
              `/article/${record.noteId}/${record._id}/${encodeURIComponent(
                record.title,
              )}`,
            )
          }
        >
          文章管理
        </a>,
        <Popconfirm
          title="确认删除？"
          okText="删除"
          cancelText="取消"
          onConfirm={() => {
            deleteRecord(record._id, record.noteId);
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
          笔记分类管理: <b>{decodeURIComponent(title)}</b>
        </span>
      }
      loading={loading}
      columns={columns}
      dataSource={list}
      pagination={false}
      options={false}
      search={false}
      toolBarRender={() => [
        <CategoryForm
          trigger={<Button type="primary">新增一级分类</Button>}
          title="新增分类"
          record={{
            sort: 50,
            parentId: '',
            level: 0,
            noteId,
          }}
          onSuccess={() => {
            getList(noteId);
          }}
        />,
        <Button onClick={() => history.goBack()}>返回</Button>,
      ]}
    />
  );
}

export default Category;
