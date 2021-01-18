import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/login', component: '@/pages/login' },
    {
      path: '/',
      component: '@/pages/app',
      routes: [
        { title: '笔记管理', path: '/index', component: '@/pages/index' },
        {
          title: '分类管理',
          path: '/category/:noteId/:title',
          component: '@/pages/category',
        },
        {
          title: '文章管理',
          path: '/article/:noteId/:cateId/:title',
          component: '@/pages/article',
        },
        {
          title: '文章内容编辑',
          path: '/articleContent/:articleId/:title',
          component: '@/pages/articleContent',
        },
      ],
    },
  ],
});
