---
Sidebar: auto
---

# Generator Configuration

::: tip
Be sure to read the guide to [Create Generator](./guide/creating-generator.md) first!
:::

The Generator configuration, the `sherry-config.js` file located in the root of the Generator, is used to create a [Generator Instance](./generator-instance.md) that defines how to generate a new project.

## Tips

- `type`: `{[k:string]: any} | undefined`

`prompts` is a list of questions you want users to ask questions.

All prompt types in [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#question) are supported here. But there are some differences in the prompt options:

### `when`

The `when` attribute in each prompt can also be a string, which will be executed with `answers` as the context.

E.g:

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

Obviously, it is equivalent to `when:answers => answers.useBundler`.

### `store`

- __type__:`boolean`
- __ default value __: `false`

This is a property only for Sherry that stores the user's input so that Sherry can use the cached value as the default next time the Generator is run. Note that different versions of the Generator store the user's input in a different location.

### `default`

When `default` is a string, you can use `{propName}` to access the properties on the [Generator instance](./generator-instance.md). For example, use `default:'{gitUser.name}'` to set the default to the name of the git user. If you want to disable interpolation here, use a double backslash: `\\{gitUser.name}`.

## Actions

__Type__:`Action[]` | `(this: Generator) => Action[] | Promise<Action[]>`

`actions` is used to manipulate files. There are 4 operations in total:

- __type__: action type
- __when__: [`when`](#when) similar to `prompts`.

### `type:'add'`

Add the files in the `template` directory to the target directory.

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

- __files__: One or more glob patterns, parsing files relative to [`templateDir`](#templatedir).
- __transform__: Enable/disable transformer, the default value is true.
- __transformInclude__: One or more glob patterns that define the specific files that you want to convert by transformer transformation**transformer.
- __transformExclude__: One or more glob patterns for defining files that are not converted by transformer**.
- __filters__: Exclude certain files from being added. It is an object whose key is a glob pattern, the value should be a boolean or a string, and it will also be evaluated using `answers` as the context.

### `type:'modify'`

Modify the files in the target directory.

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
```- __files__: One or more glob patterns.
- __handler__: A function to get the contents of a new file. For `.json`, we automatically parse and string it. Otherwise you will receive the original string.

### `type:'move'`

Move the file to the specified directory.

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

--__patterns__: Each can be a glob pattern, which should match __0 or 1 __ files in the target directory.

### `type:'remove'`

Delete the files in the target directory.

```JS
actions: [
  {
    type: 'remove',
    files: '**/*.ts',
    when: '!useTypescript'
  }
]
```

- __files__: One or more glob patterns to match files that should be deleted.

## templateDir

- __Type__:`string`
- __Default__:`template`

Working directory for file operations: `add`.

## subGenerators

You can register the child generator with the `subGenerators` option:

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

Then you can call these child generators like this:

``` Celebration
Sherry sample:foo
Sherry sample:bar
```

## Hooks

### `prepare`

__Type__:`(this: Generator) => Prompt<void> | void`

Executed before prompts and actions, you can throw an error here to exit the process:

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

__Type__: `(this: Generator) => Prompt | void`

Execute after all operations have been completed.

```js
module.exports = {
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showCompleteTips()
  }
}
```
