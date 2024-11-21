import { defineConfig } from "vitepress";
// https://vitepress.dev/reference/site-config


export default defineConfig({
  lang: 'zh-CN',
  title: "我的笔记小屋",
  // description: "this is my test",
  base: "/my-notes/",
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    lastUpdatedText: "最后更新时间",
    editLink: {
      pattern: 'https://github.com/zengxuanlin/my-notes/tree/main/docs/:path',
      text: '在GitHub上编辑此页面'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "MAC相关软件", link: "/mac-software" },
      { text: "收集的网站", link: "/web-site" },
      {
        text: "技术相关",
        items: [
          { text: "前端布局拖动swapy.min.js", link: "/20241107d1" },
          { text: "websocket封装", link: "/20241107d2" },
        ]
      }
    ],

    sidebar: [
      { text: "MAC相关软件", link: "/mac-software" },
      { text: "收集的网站", link: "/web-site" },
      {
        text: "技术相关",
        items: [
          { text: "前端布局拖动swapy.min.js", link: "/20241107d1" },
          { text: "websocket封装", link: "/20241107d2" },
        ],
      },
    ],

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});


