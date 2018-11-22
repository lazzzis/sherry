# Creating Generators

SAO provides a generator for creating a new generator:

```bash
Sao generator sao-sample
# Make sure to replace `sao-sample` with your desired generator name
```

## Folder Structure

The basic folder structure is as follows:

```bash
.
├── LICENSE
├── README.md
├── circle.yml
├── package.json
├── saofile.js
├── template
│ ├── LICENSE
│ ├── README.md
│ └── gitignore
├── test
│ └── test.js
└── yarn.lock # Or package-lock.json if you don't have Yarn on your machine
```

_ __saofile.js__:

```js
Const superb = require('superb')

Module.exports = {
  Prompts() {
    Return [
      {
        Name: 'name',
        Message: 'What is the name of the new project',
        Default: this.outFolder,
        Filter: val => val.toLowerCase()
      },
      {
        Name: 'description',
        Message: 'How would you descripe the new project',
        Default: `my ${superb()} project`
      },
      {
        Name: 'username',
        Message: 'What is your GitHub username',
        Default: this.gitUser.username || this.gitUser.name,
        Filter: val => val.toLowerCase(),
        Store: true
      },
      {
        Name: 'email',
        Message: 'What is your email?',
        Default: this.gitUser.email,
        Store: true
      },
      {
        Message: 'The URL of your website',
        Default({ username }) {
          Return `github.com/${username}`
        },
        Store: true
      }
    ]
  },
  Actions: [
    {
      Type: 'add',
      // Copy and transform all files in `template` folder into output directory
      Files: '**'
    },
    {
      Type: 'move',
      Patterns: {
        Gitignore: '.gitignore'
      }
    }
  ],
  Async completed() {
    this.gitInit()
    Await this.npmInstall()
    this.showProjectTips()
  }
}
```

- `prompts`: CLI prompts to retrive answers from current user.
- `actions`: A series of actions to manipulate files.
- `completed`: A function that will be invoked when the whole process is finished.Now you can run the generator to generate a new project:

```bash
Sao ../sao-sample new-project
```

Note that if no `saofile.js` was found in the generator, SAO will use a [default one](https://github.com/saojs/sao/blob/master/lib/saofile.fallback.js) which would Simply copy all files into output directory.

## Access Generator Instance

A [generator instance](../generator-instance.md) will be created from exported object, if you want to access the instance you can use `actions` `prompts` as `function`, the generator instance will be available as `this` in the function:

```js
Module.exports = {
  Prompts() {
    Return [
      {
        Name: 'author',
        Message: 'What is your name',
        // Use the value of `git config --global user.name` as the default value
        Default: this.gitUser.name
      }
    ]
  },
  // ...
}
```

For a complete list of options in `saofile.js`, please check out [SAO File References](../saofile.md).