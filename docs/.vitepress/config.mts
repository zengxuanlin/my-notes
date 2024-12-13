import { defineConfig } from "vitepress";
// https://vitepress.dev/reference/site-config


export default defineConfig({
  lang: 'zh-CN',
  title: "我的笔记小屋",
  head: [['link', { rel: 'icon', href: '/my-notes/website-icon.png' }]],
  // description: "this is my test",
  base: "/",
  lastUpdated: true,
  themeConfig: {
    logo:"/website-icon.png",
    search: {
      provider: 'local'
    },
    lastUpdatedText: "最后更新时间",
    editLink: {
      pattern: 'https://github.com/zengxuanlin/my-notes/tree/main/docs/:path',
      text: '在GitHub上编辑此页面'
    },
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2019-present Evan You'
    // },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "日记列表", link: "/mac-software" },
    ],

    sidebar: [
      { text: "MAC相关软件", link: "/mac-software" },
      { text: "收集的网站", link: "/web-site" },
      {
        text: "技术相关",
        items: [
          { text: "前端布局拖动swapy.min.js", link: "/20241107d1" },
          { text: "websocket封装", link: "/20241107d2" },
          { text: "前端复杂密码校验", link: "/passwordValidate" },
          { text: "Nginx 常用的基础配置", link: "/nginxConfig" },
          { text: "wangEditor扩展自定义功能", link: "/wangEditor-extend" },
          { text: "shell脚本简单爬虫示例", link: '/getDataByShell' }
        ],
      },
    ],

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});


