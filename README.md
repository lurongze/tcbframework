<p align="center">
  <img height="100px" src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/logo.png" center />
</p>

# [Adroit Book](https://github.com/lurongze/tcbframework)

一个Markdown笔记应用。

## 开发者信息

本应用由 LLDMZ 开发提供

## 使用

登录可添加笔记，分类，使用Markdown编辑文章，可以让其他人查看你分享的笔记内容！

## 部署

本项目基于腾讯开源项目 [CloudBase Framework](https://github.com/Tencent/cloudbase-framework) [![star](https://img.shields.io/github/stars/Tencent/cloudbase-framework?style=social)](https://github.com/Tencent/cloudbase-framework) 开发部署，支持一键云端部署  
点击下方按钮直接部署：  

<a title='一键部署' alt='一键部署' href="https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Flurongze%2Ftcbframework&branch=master" target="_blank"><img title='一键部署' alt='一键部署' src="https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg"/></a>

### 配置

无

### 依赖

无

## 开发

你也可以下载项目后，使用 [CloudBase CLI](https://docs.cloudbase.net/cli-v1/intro.html) 在终端中一键部署。

```
npx @cloudbase/cli framework deploy -e 环境id
```

## 示例网址
示例的网址是使用云开发免费环境的，所以是自己另外部署到腾讯的文件服务器，没有使用静态网站托管服务。  
例子网址的内容，将不保证存储，随时会删掉，仅仅做示例用：  
<https://book-1253286615.cos-website.ap-guangzhou.myqcloud.com>

## 注意事项
由于一键部署暂时还不支持自动开启邮箱登录和静态网站托管配置修改，所有得手动完成以下操作：
1. 云开发中需要同时开启**匿名登录**和**邮箱登录**。
2. 云开发的**静态网站托管**要增加路由配置。

## 文档

- [CloudBase Framework 文档](https://docs.cloudbase.net/framework/)
- [umijs 文档](https://umijs.org/zh-CN)

## 静态网站托管路由配置
- 由于是单页应用，需要配置路由，让路径都重定向到index.html。根据下图添加两条配置即可。
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/sitesetting.png" center />

## 云开发登录配置
- 开启**匿名登录**和**邮箱登录**
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/denglukaiqi.png" center />

- 邮箱配置（QQ邮箱为例子），设置->账户
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/qqsettingbtn.png" center />

- 配置SMTP。开启途中开启的服务，生成授权码。
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/smtpsetting.png" center />

- 回到云开发控制台的登录授权配置，点击配置发件人
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/emailsetting.png" center />

- 输入对应信息
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/smtpinput.png" center />

- 点击应用配置，输入对应的信息
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/smtpinput.png" center />

## 项目截图
- 登录页
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/login.png" center />

- 首页
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/index.png" center />

- 笔记分类管理
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/cate-list.png" center />

<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/cate-add.png" center />

- 文章管理
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/article-list.png" center />

- Markdown编辑器
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/markdown-editor.png" center />

- 图片上传
<img src="https://adroit-book-1253286615.cos-website.ap-guangzhou.myqcloud.com/images/tcb/upload.png" center />



## Licence

开源协议文档请参阅 [Apache License 2.0](https://github.com/Tencent/cloudbase-framework/blob/master/LICENSE)