import React, { useState, useEffect } from 'react';
import { Popconfirm } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { history } from 'umi';
import { BookOutlined } from '@ant-design/icons';
import useNotes from '@/hooks/useNotes';
import { helper } from '@/utils';
function Site(props) {
  const { onChangeRoute } = props;
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [noteList, loading, getNoteList, saveNote, deleteNote] = useNotes();

  function onSave(key, row) {
    saveNote(row);
  }

  useEffect(() => {
    getNoteList();
  }, []);

  useEffect(() => {
    const resList = noteList.map(s => {
      return {
        path: `/category/${s._id}/${encodeURIComponent(s.title)}`,
        name: s.title,
        icon: <BookOutlined />,
      };
    });
    helper.isFuncAndRun(onChangeRoute, resList);
  }, [noteList]);

  const columns = [
    {
      title: '笔记名称',
      dataIndex: 'title',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '笔记名称为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit',
      formItemProps: () => {
        return {
          defaultValue: 50,
          rules: [{ required: true, message: '排序为必填项' }],
        };
      },
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
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            history.push(
              `/category/${record._id}/${encodeURIComponent(record.title)}`,
            );
          }}
        >
          分类管理
        </a>,
        <Popconfirm
          title="确认删除？"
          okText="删除"
          cancelText="取消"
          onConfirm={() => {
            deleteNote(record._id);
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <EditableProTable
      rowKey="_id"
      headerTitle="笔记管理"
      maxLength={500}
      loading={loading}
      columns={columns}
      value={noteList}
      editable={{
        editableKeys,
        onSave,
        onChange: setEditableRowKeys,
      }}
    />
  );
}

export default Site;
