---
侧边栏：自动
---

# Generator Config

:::tip tip
请务必先阅读 [创建生成器]（./ guide / creation-generators.md）的指南！
:::

SAO文件，即`saofile.js`位于生成器的根目录中，它用于创建生成器实例，该实例定义如何生成新项目。

##提示

__Type__：`提示[]`| `（this：Generator）=>提示[] |许<提示[]>`

`prompts`是您希望用户回答的问题列表。

这里支持[Inquirer.js]（https://github.com/SBoudrias/Inquirer.js#question）中的所有提示类型。但是提示选项有一些差异：

###`when`

每个提示中的`when`属性可以__also__是一个字符串，将在`answers`的上下文中进行评估。

例如：

```的js {10}
提示：[
  {
    名称：'useBundler'，
    消息：'你想要一个捆绑者'
  }，
  {
    名称：'bundler'，
    类型：'list'，
    选择：['webpack'，'parcel'，'poi']，
    何时：'useBundler'
  }
]
```

基本上它相当于`when：answers => answers.useBundler`。

###`store`

- __Type__：`boolean`
- __Default__：`false`

这是仅适用于SAO的属性，它用于存储用户输入，以便SAO可以在下次使用存储的值作为默认值。请注意，不同版本的生成器将输入存储在不同的位置。

###`default`

当`default`是一个字符串时，你可以使用`{propName}`访问[Generator Instance]（./ generator-instance.md）上的属性。例如使用`default：'{gitUser.name}'`将默认值设置为git用户的名称。如果要在此处禁用插值，请使用双反斜杠：`\\ {gitUser.name}`。

##行动

__Type__：`Action []`| `（this：Generator）=>动作[] |许<动[]>`

`actions`用于操作文件。共有以下4种操作：

- __type__：动作类型
- __when__：类似于`prompts`的[`when`]（＃when）。

###`type：'add'`

将`template`目录中的文件添加到目标目录。

```JS
行动：[
  {
    输入：'add'，
    档案：'**'，
    过滤器：{
      'foo.js'：'！someAnswer'
    }
  }
]
```

- __files__：一个或多个glob模式，相对于[`templateDir`]（＃templatedir）解析文件。
- __transform__：启用/禁用变换器。
   - __Default__：`true`
- __transformInclude__：一个或多个glob模式，使用变换器转换特定文件。
--__transformExclude__：一个或多个glob模式，__DON'T__用变换器转换特定文件。
- __filters__：排除某些文件被添加。它是一个对象，其键是一个glob模式，值应该是一个布尔值或一个字符串，它将在`answers`的上下文中进行计算。

###`type：'modify'

修改目标目录中的文件。

```JS
行动：[
  {
    类型：'修改'，
    文件：'package.json'，
    handler（data，filepath）{
      data.main ='。/ foo.js'
      返回数据
    }
  }
]
```

- __files__：一个或多个glob模式。
- __handler __：我们用来获取新文件内容的函数。对于`.json`，我们自动解析并对其进行字符串化。否则你会收到原始字符串。

###`type：'move'`

移动目标目录中的文件。

```JS
行动：[
  {
    类型：'移动'，
    模式：{
      'index - * .js'：'index.js'
    }
  }
]
```

--__patterns__：每个条目都可以是一个glob模式，它应该匹配目标目录中的__zero或one__文件。

###`type：'remove'

删除目标目录中的文件。

```JS
行动：[
  {
    输入：'删除'，
    文件：'** / * .ts'，
    何时：'！useTypescript'
  }
]
```

- __files__：一个或多个glob模式，以匹配应删除的文件。

## templateDir

- __Type__：`string`
- __Default__：`template`

文件操作的工作目录：`add`。

##子发电机

您可以使用`subGenerators`选项注册子生成器列表：

```JS
module.exports = {
  subGenerators：[
    {
      名字：'foo'，
      //相对于saofile的生成器的路径
      发电机：'。/ generator / foo'
    }，
    {
      名称：'bar'，
      //或者在这里使用一个包，比如`sao-bar`
      //相对于saofile，它也得到了解决
      发电机：'sao-bar'
    }
  ]
}
```

然后你可以像这样调用这些子生成器：

```庆典
sao示例：foo
sao示例：吧
```

## Hooks

###`prepare`

__Type__：`（this：Generator）=>提示<void> | void`

在提示和操作之前执行，您可以在此处抛出错误以退出进程：

```JS
module.exports = {
  //在输出目录中需要package.json的生成器
  async prepare（）{
    const hasPkg = await this.fs.pathExists（this.resolve（'package.json'））
    if（！hasPkg）{
      抛出this.createError（'缺少package.json'）
      //你也可以直接抛出新的错误（'...'）
      //而`this.createError`只显示没有堆栈跟踪的错误消息。
    }
  }
}
```

###`completed`

__Type__：`（this：Generator）=>提示<void> | void`

完成所有操作后执行。

```JS
module.exports = {
  async completed（）{
    this.gitInit（）
