# Introduction

## Sherry What?

**Sherry** (['ʃerɪ]) is originally a wine made from white grapes. Here, Sherry helps you quickly launch a new project with existing [generators](https://github.com/sherry/awesome-sao) created by yourself.

## Why not use Yeoman?

[Yeoman](http://yeoman.io/) Great, but writing the Yeoman generator is time consuming, and I created Sherry to simplify the way I write and use the Generator.

## Why not use SAO?

In fact, Sherry's creation has received a lot of impact from SAO, the biggest difference is that Sherry provides a plug-in mechanism that allows you to extend Sherry's capabilities. Especially for enterprise developers, you will benefit from it.

## Quick View

Here we have a Sherry Generator generator for creating a new Node.js module, which is published on npm as [sherry-nm](https://npm.im/sherry-nm), or in [ Http://github.com/sherry/sherry-nm](http://github.com/sherry/sherry-nm) Find it:

```bash
Sherry nm my-node-module
```

By running this command, Sherry will try to find a cached version of sherry-nm, which will be downloaded from npm if it is not already cached. Then, Sherry will generate a new project in the my-node-module directory in the current directory based on `sherry-config.js` in the generator.

Since sherry-nm is also placed on Github, you can also use the generator from there:

```bash
Sherry sherry/sao-nm my-node-module
```