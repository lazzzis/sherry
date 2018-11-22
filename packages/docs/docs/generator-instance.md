---
sidebar: auto
---

# Generator Instance

You can access the Generator instance in the Sherry file via `this`.

## Attributes

### answers

- Type: `{{k:string]:any} | undefined`

The answer to the prompt. When you access it in `prompts`, it will be `undefined`.

### gitUser

- Type: `{name?:string,username?:string,email?:string}`

The global configuration of the git user.

### outDir

- Type: `string`

The absolute path to the output directory.

### outFolder

- Type: `string`

The folder name of the output directory.

### npmClient

- Type: `'npm'| 'yarn'`

Npm client.

### fs

- Type: [fs-extra](https://github.com/jprichardson/node-fs-extra)

### logger

- Type: [Logger](https://github.com/saojs/sao/blob/master/lib/logger.js)

### spinner

- Type: [Ora](https://github.com/sindresorhus/ora)

### chalk

- Type: [Chalk](https://github.com/chalk/chalk)

## method

### gitInit

- Type: `()=> void`

Run `git init` synchronously in the output directory.

### npmInstall

- Type: `NpmInstall`

Use `npm` or `yarn` to install the package in the output directory.

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

- Type: `()=> void`

A message showing the successful creation of the project.
