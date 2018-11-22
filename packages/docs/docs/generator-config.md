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
Prompts: [
  {
    Name: 'useBundler',
    Message: 'Do you want a bundler'
  },
  {
    Name: 'bundler',
    Type: 'list',
    Choices: ['webpack', 'parcel', 'poi'],
    When: 'useBundler'
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
Actions: [
  {
    Type: 'add',
    Files: '**',
    Filters: {
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
Actions: [
  {
    Type: 'modify',
    Files: 'package.json',
    Handler(data, filepath) {
      Data.main = './foo.js'
      Return data
    }
  }
]
```- __files__: One or more glob patterns.
- __handler__: A function to get the contents of a new file. For `.json`, we automatically parse and string it. Otherwise you will receive the original string.

### `type:'move'`

Move the file to the specified directory.

```js
Actions: [
  {
    Type: 'move',
    Patterns: {
      'index-*.js': 'index.js'
    }
  }
]
```

--__patterns__: Each can be a glob pattern, which should match __0 or 1 __ files in the target directory.

### `type:'remove'`

Delete the files in the target directory.

```JS
Actions: [
{
Type: 'remove',
Files: '**/*.ts',
When: '!useTypescript'
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
Module.exports = {
  subGenerators: [
    {
      Name: 'foo',
      // A path to the generator, relative to sherry-config.js .
      // A path to the generator, relative to the
      Generator: './generators/foo'
    },
    {
      Name: 'bar',
      // Or use an npm package, like `sherry-bar` here.
      Generator: 'sao-bar'
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
Module.exports = {
  // A generator that needs to have package.json in the output directory to run
  Async prepare() {
    Const hasPkg = await this.fs.pathExists(this.resolve('package.json'))
    If (!hasPkg) {
      Throw this.createError('Missing package.json')
      // You can also throw an error directly using throw new Error('...')
      // just `this.createError` will only display an error message without an error stack
    }
  }
}
```

### `completed`

__Type__: `(this: Generator) => Prompt | void`

Execute after all operations have been completed.

```js
Module.exports = {
  Async completed() {
    this.gitInit()
    Await this.npmInstall()
    this.showCompleteTips()
  }
}
```