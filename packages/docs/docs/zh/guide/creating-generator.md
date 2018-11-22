# 创建 Generator

Sherry 提供了一个用于创建新的 Generator 的 Generator：

```bash
sherry generator sherry-sample
# Make sure to replace `sherry-sample` with your desired generator name
```

## 目录结构

基本文件夹结构如下：

```bash
.
├── LICENSE
├── README.md
├── circle.yml
├── package.json
├── sherryfile.js
├── template
│   ├── LICENSE
│   ├── README.md
│   └── gitignore
├── test
│   └── test.js
└── yarn.lock # Or package-lock.json if you don't have Yarn on your machine
```

📝 __sherryfile.js__:

```js
const superb = require('superb')

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true
      }
    ]
  },
  actions: [
    {
      type: 'add',
      // Copy and transform all files in `template` folder into output directory
      files: '**'
    },
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore'
      }
    }
  ],
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
}
```

- `prompts`: 从当前用户获取答复的 prompts。
- `actions`: 操纵文件的一系列动作。
- `completed`: 一个会在整个流程结束的时候执行的函数。

接着你可以运行这个 Generator 来生成一个新项目：

```bash
sherry ../sherry-sample new-project
```

值得注意的是，如果在 Generator 中没有找到 `sherry-config.js` ，Sherry 将会使用一个[默认的配置](https://github.com/sherryjs/sherry/blob/master/lib/sherryfile.fallback.js)，它会简单地将所有文件复制到目标目录中。

## 访问 Generator 上下文

一个 [Generator 实例](../generator-instance.md) 将会根据 Generator 导出的对象来创建，如果你想访问这个你可以 把 `actions` 和 `prompts` 来当成函数使用的实例，你可以使用 `this` 来访问它：

```js
module.exports = {
  prompts() {
    return [
      {
        name: 'author',
        message: 'What is your name',
        // Use the value of `git config --global user.name` as the default value
        default: this.gitUser.name
      }
    ]
  },
  // ...
}
```

想要查看所有 `sherry-config.js` 中支持的选项，请查看 [Sherry Generator Config](../generator-config.md).

