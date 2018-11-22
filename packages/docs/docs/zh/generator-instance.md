---
侧边栏：自动
---

# Generator Instance

您可以通过 `this` 访问 Sherry 文件中的 Generator 实例。

## 属性

### answers

- 类型：`{{k：string]：any} | undefined`

提示的答案。当你在`prompts`中访问它时，它将是 `undefined`。

### gitUser

- 类型：`{name?：string，username?：string，email?：string}`

git 用户的全局配置。

### outDir

- 类型：`string`

输出目录的绝对路径。

### outFolder

- 类型：`string`

输出目录的文件夹名称。

### npmClient

- 类型：`'npm'| 'yarn'`

npm 客户端。

### fs

- 类型：[fs-extra](https://github.com/jprichardson/node-fs-extra)

### logger

- 类型：[Logger](https://github.com/saojs/sao/blob/master/lib/logger.js)

### spinner

- 类型：[Ora](https://github.com/sindresorhus/ora)

### chalk

- 类型：[Chalk](https://github.com/chalk/chalk)

## 方法

### gitInit

- 类型：`()=> void`

在输出目录中同步运行 `git init`。

### npmInstall

- 类型：`NpmInstall`

使用 `npm` 或 `yarn` 在输出目录中安装包。

```typescript
function npmInstall(opts?: InstallOpts): Promise<void>

interface InstallOpts {
  /* The packages to install, if omited, it will install packages in `package.json` */
  packages?: string[]
  /* Install packages as devDependencies, false by default */
  saveDev?: boolean
}
```

### showProjectTips

- 类型：`()=> void`

显示成功创建项目的消息。
