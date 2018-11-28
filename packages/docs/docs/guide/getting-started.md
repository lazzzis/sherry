# Getting Started

## Installation

Sherry is a CLI developed using JavaScript, so you can install it via npm:

```bash
Npm i -g sherry
```

Or if you use Yarn:

```bash
Yarn global add sherry
```

It will install the `sherry` command on your command line. If all goes well, you will see help information for this CLI.

## Using Generator

```bash
Sherry nm my-project
```

After running this command, Sherry will install a generator, in this case [sherry-nm] from npm (https://npm.im/sherry-nm), and use it to generate files to `my- In the project` directory.

If you want it to generate the current directory, just omit the second parameter: `sherry nm`.

The Generator can be one of the following:

- __local directory __, such as: `sherry ./path/to/my-generator`
- __ an npm package __, such as: `sherry react` will pull `sherry-react`.
  - To use an npm package that doesn't follow the `sherry-*` naming convention, just prefix it like this: `sherry npm:foo`, then Sherry will pull `foo` instead of `sherry-foo`.
- __ A git repository __, such as: `sherry sherry/sherry-nm` will be `github.com/egoist/sherry-nm`, you can use the following prefix to specify other git hosting providers.
  - `gitlab:` For GitLab.
  - `bitbucket:` For BitBucket.

<TerminalDemo url="/images/demo.gif"/>

### Version

For the npm package, you can use a specific version of this Generator

```bash
Sherry nm@1
Sherry nm@0.2
```

The syntax here is the same as `npm install`.

For a git repository, you can use a specific tag, commit, or a specific branch:

```bash
Sherry nm#dev
Sherry nm#v1.0.0
```

### Sub-generators

A Generator might contain sub-generators, and you can run them like this:

```bash
Sherry nm:donate
```

Behind `:` is a sub-generator named `donate`. By running this command, Sherry will run the sub-generator, which will add a `postinstall` script to `package.json` for display. Donate the URL.

::: warning
Sub-generators should be run in an existing project, which means that the output directory is always the current working directory.
:::

### Update the cached Generator

Once you run a generator, it will be cached locally in the `~/.sherry` directory. To run a generator with the latest version, you can add the `--update` or `-u` flag.
