# 快速上手

## 安装

Sherry 是一个使用 JavaScript 开发的 CLI，所以你可以通过 npm 来安装它：

```bash
npm i -g sherry
```

或者，如果你使用 Yarn：

```bash
yarn global add sherry
```

它将会在你的命令行中安装 `sherry` 这个指令，如果一切顺利，你将会看到这个 CLI 的帮助信息。

## 使用 Generator

```bash
sherry nm my-project
```

运行这个指令后，Sherry 将会安装一个生成器，在这种情况下是来自 npm 的 [sherry-nm](https://npm.im/sherry-nm)，并使用它生成文件到 `my-project` 目录中。

如果你想让它生成当前目录，只需省略第二个参数：`sherry nm`。

Generator 可以是以下之一：

- __本地目录__, 如: `sherry ./path/to/my-generator`
- __一个 npm 包__, 如：`sherry react` 将会去拉取 `sherry-react`.
  - 想要使用一个没有遵循 `sherry-*` 命名规范的 npm 包，只需要像这样加上前缀： `sherry npm:foo`，接着 Sherry 会去拉取  `foo` 而不是 `sherry-foo`。
- __一个 git 仓库__, 如：`sherry sherry/sherry-nm` 将会是 `github.com/egoist/sherry-nm`, 你可以使用如下的前缀来指定其他的 git 托管服务提供者。
  - `gitlab:` For GitLab.
  - `bitbucket:` For BitBucket.

<TerminalDemo url="/images/demo.gif"/>

### 版本

对于 npm 包，你可以使用这个 Generator 的某个指定版本

```bash
sherry nm@1
sherry nm@0.2
```

这里的语法和 `npm install` 一致。

对于 git 仓库，你可以所使用一个具体的 tag、commit 或者某个特定的分支：

```bash
sherry nm#dev
sherry nm#v1.0.0
```

### Sub-generators

一个 Generator 可能包含 sub-generators，你可以像这样运行它们：

```bash
sherry nm:donate
```

在 `:` 后面的是一个名叫 `donate` 的 sub-generator，通过运行这个指令，Sherry 将会运行这个  sub-generator，它会在 `package.json` 中增加一个 `postinstall` 脚本用于显示捐献 URL。

::: warning
Sub-generators 应该在现有项目中运行，这意味着输出目录始终是当前工作目录。
:::

### 更新已被缓存的 Generator

一旦你运行了一个生成器，它将被本地缓存在 `~/.sherry` 目录中。 要使用最新版本运行一个 Generator，可以添加 `--update` 或 `-u` 标志。
