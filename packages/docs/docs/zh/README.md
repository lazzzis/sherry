# 介绍

## Sherry 是什么?

**Sherry** (['ʃerɪ]) 是一个脚手架工具，它通过现有的或者你自己创建的 [generators](https://github.com/sherry/awesome-sao) 来帮你快速地启动一个新的项目。

## 为什么不使用 Yeoman?

[Yeoman](http://yeoman.io/) 很棒，但是编写 Yeoman 生成器很耗时，我创建 Sherry 是为了简化编写和使用 Generator 的方式。

## 为什么不使用 SAO?

SAO 真的很棒，事实上，Sherry 的创建也收到了 SAO 的很多影响，最大的不同在于 Sherry 提供了插件机制，让你能够拓展 Sherry 的功能。尤其是对于企业开发者，你将会非常容易地拓展你想要的功能。

## 快速浏览

这里我们有一个用于创建新的 Node.js 模块的 Sherry Generator 生成器，它以 [sherry-nm](https://npm.im/sherry-nm) 的形式在 npm 上发布，也可在 [http://github.com/sherry/sherry-nm](http://github.com/sherry/sherry-nm) 找到它：

```bash
sherry nm my-node-module
```

通过运行这个命令，Sherry 将尝试找到一个缓存版本的 sherry-nm，如果它还没有被缓存，则会从 npm 下载。然后，Sherry 将会根据生成器中的 `sherry-config.js` 在当前目录下的 my-node-module 目录中生成一个新项目

由于 sherry-nm 也放在在 Github 上，所以你也可以从 Github 使用这个 Generator：

```bash
sherry sherry/sao-nm my-node-module
```
