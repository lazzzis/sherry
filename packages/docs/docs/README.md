# Introduction

## Sherry What?

**Sherry** (['ʃerɪ]) is a scaffolding tool that helps you get started quickly with existing or your own created [generators](https://github.com/sherry/awesome-sao) A new project.

## Why not use Yeoman?

[Yeoman](http://yeoman.io/) Great, but writing the Yeoman generator is time consuming, and I created Sherry to simplify the way I write and use the Generator.

## Why not use SAO?

SAO is really great. In fact, Sherry's creation has also received a lot of influence from SAO. The biggest difference is that Sherry provides a plug-in mechanism that allows you to extend Sherry's functionality. Especially for enterprise developers, you will be able to easily expand the features you want.

## Quick View

Here we have a Sherry Generator generator for creating a new Node.js module, which is published on npm as [sherry-nm](https://npm.im/sherry-nm), or in [ Http://github.com/sherry/sherry-nm](http://github.com/sherry/sherry-nm) Find it:

```bash
Sherry nm my-node-module
```

By running this command, Sherry will try to find a cached version of sherry-nm, which will be downloaded from npm if it is not already cached. Then, Sherry will generate a new project in the my-node-module directory in the current directory based on `sherry-config.js` in the generator.

Since sherry-nm is also placed on Github, you can also use this generator from Github:

```bash
Sherry sherry/sao-nm my-node-module
```