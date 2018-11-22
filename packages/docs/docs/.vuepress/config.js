const { description } = require('../../../../package')

module.exports = {
  description,

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Sherry',
      description: 'A Well-Brewed Scaffolding Tool'
    },

    '/zh/': {
      lang: 'zh-CN',
      title: 'Sherry',
      description: '一个精心酿制的脚手架工具'
    }
  },

  themeConfig: {
    repo: 'sherry/sherry',

    docsDir: 'docs',

    editLinks: true,

    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/getting-started'
          },
          {
            text: 'References',
            items: [
              {
                text: 'API',
                link: '/api'
              },
              {
                text: 'SAO File',
                link: '/saofile'
              },
              {
                text: 'Generator Instance',
                link: '/generator-instance'
              }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Guide',
            collapsable: false,
            children: [
              '/',
              '/guide/getting-started',
              '/guide/creating-generators',
              '/guide/testing-generators',
              '/guide/sharing-generators'
            ]
          }
        ]
      },

      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: 'Guide',
            link: '/zh/guide/getting-started'
          },
          {
            text: 'Generator 配置',
            link: '/zh/generator-config'
          },
          {
            text: 'Generator 实例',
            link: '/zh/generator-instance'
          },
          {
            text: 'Node API',
            link: '/zh/api'
          }
        ],

        sidebar: [
          {
            title: '指南',
            collapsable: false,
            children: [
              '/zh/',
              '/zh/guide/getting-started',
              '/zh/guide/creating-generator',
              '/zh/guide/testing-generator',
              '/zh/guide/sharing-generator'
            ]
          }
        ]
      }
    }
  }
}
