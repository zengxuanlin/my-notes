import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "日常记录",
  description: "this is my test",
  base: "/",
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/zengxuanlin/my-notes/tree/main/docs/:path',
      text: '在GitHub上编辑此页面'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
    ],

    sidebar: [
      {
        text: "技术相关",
        items: [
          { text: "前端布局拖动swapy.min.js", link: "/20241107d1" },
          { text: "websocket封装", link: "/20241107d2" },
        ],
      },
      // {
      //   text: "其他记录",
      //   items: [
      //     { text: "生活", link: "/20241107d1" },
      //   ],
      // },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
