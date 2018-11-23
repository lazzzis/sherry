---
sidebar: auto
---

# Generator 配置

::: tip 
请务必先阅读 [创建 Generator](./guide/creating-generator.md) 的指南！
:::

Generator 配置，即位于 Generator 根目录中的 `sherry-config.js` 文件，它用于创建 [Generator 实例](./generator-instance.md)，该实例用于定义如何生成新项目。

## 提示

- `类型`: `{[k:string]: any} | undefined`

`prompts` 是你希望用户做出问题的的问题列表。

这里支持 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#question) 中的所有 prompt 类型。但是提示选项有一些差异：

### `when`

每个 prompt 中的 `when` 属性也可以是一个字符串，它将会用 `answers` 作为上下文来执行。

例如：

```js{10}
prompts: [
  {
    name: 'useBundler',
    message: 'Do you want a bundler'
  },
  {
    name: 'bundler',
    type: 'list',
    choices: ['webpack', 'parcel', 'poi'],
    when: 'useBundler'
  }
]
```

很明显，它相当于`when：answers => answers.useBundler`。

### `store`

- __类型__：`boolean`
- __默认值__：`false`

这是仅用于 Sherry 的属性，它用于存储用户的输入，以便 Sherry 可以在下次运行 Generator 时使用缓存的值作为默认值。请注意，不同版本的 Generator 会将用户的输入存储在不同的位置。

### `default`

当 `default` 是一个字符串时，你可以使用 `{propName}` 访问 [Generator 实例](./generator-instance.md) 上的属性。例如使用 `default：'{gitUser.name}'` 将默认值设置为 git 用户的名称。如果要在此处禁用插值，请使用双反斜杠：`\\{gitUser.name}`。

## Actions

__类型__：`Action[]` | `(this: Generator) => Action[] | Promise<Action[]>`

`actions` 用于操作文件。共有以下 4 种操作：

- __type__：动作类型
- __when__：类似于`prompts`的[`when`]（＃when）。

### `type：'add'`

将 `template` 目录中的文件添加到目标目录中。

```js
actions: [
  {
    type: 'add',
    files: '**',
    filters: {
      'foo.js': '!someAnswer'
    }
  }
]
```

- __files__：一个或多个 glob pattern，相对于 [`templateDir`](#templatedir) 解析文件。
- __transform__：启用/禁用 transformer，默认值是 true。
- __transformInclude__：一个或多个 glob pattern，用于定义**想被 transformer 转换**transformer 转换的特定文件。
- __transformExclude__：一个或多个 glob pattern，用于定义**不被 transformer 转换**的文件。
- __filters__：排除某些文件被添加。它是一个对象，其键是一个 glob 模式，值应该是一个布尔值或一个字符串，它也会使用 `answers` 作为上下文来进行计算。

### `type：'modify'`

修改目标目录中的文件。

```JS
actions: [
  {
    type: 'modify',
    files: 'package.json',
    handler(data, filepath) {
      data.main = './foo.js'
      return data
    }
  }
]
```

- __files__：一个或多个 glob pattern。
- __handler__：用来获取新文件内容的函数。对于 `.json`，我们自动解析并对其进行字符串化。否则你会收到原始字符串。

### `type：'move'`

移动文件到指定目录中。

```js
actions: [
  {
    type: 'move',
    patterns: {
      'index-*.js': 'index.js'
    }
  }
]
```

--__patterns__：每个都可以是一个 glob pattern，它应该匹配目标目录中的__0个或1个__文件。

### `type：'remove'`

删除目标目录中的文件。

```JS
actions: [
  {
    type: 'remove',
    files: '**/*.ts',
    when: '!useTypescript'
  }
]
```

- __files__：一个或多个 glob pattern，以匹配应该被删除的文件。

## templateDir

- __Type__：`string`
- __Default__：`template`

文件操作的工作目录：`add`。

## subGenerators

你可以使用 `subGenerators` 选项来注册子生成器：

```js
module.exports = {
  subGenerators: [
    {
      name: 'foo',
      // 一个指向 generator 的路径，相对于 sherry-config.js 。
      // A path to the generator, relative to the 
      generator: './generators/foo'
    },
    {
      name: 'bar',
      // 或者使用一个 npm 包，就像这里的 `sherry-bar`
      generator: 'sherry-bar'
    }
  ]
}
```

然后你可以像这样调用这些子生成器：

```庆典
sherry sample:foo
sherry sample:bar
```

## Hooks

### `prepare`

__类型__：`(this: Generator) => Prompt<void> | void`

在 prompts 和 actions 之前被执行，你可以在此处抛出错误以退出进程：

```js
module.exports = {
  // 一个需要在输出目录有 package.json 才能运行的 generator
  async prepare() {
    const hasPkg = await this.fs.pathExists(this.resolve('package.json'))
    if (!hasPkg) {
      throw this.createError('Missing package.json')
      // 你也可以直接使用 throw new Error('...') 来抛出错误
      // 只是 `this.createError` 仅仅会显示错误信息，而没有错误堆栈
    }
  }
}
```

### `completed`

__类型__: `(this: Generator) => Prompt | void`

在完成所有操作后执行。

```js
module.exports = {
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showCompleteTips()
  }
}
```
