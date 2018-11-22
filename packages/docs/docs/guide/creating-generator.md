#创造 Generator

Sherry provides a generator for creating a new Generator:

```bash
Sherry generator sherry-sample
# Make sure to replace `sherry-sample` with your desired generator name
```

## Directory Structure

The basic folder structure is as follows:

```bash
.
├── LICENSE
├── README.md
├── circle.yml
├── package.json
├── sherryfile.js
├── template
│ ├── LICENSE
│ ├── README.md
│ └── gitignore
├── test
│ └── test.js
└── yarn.lock # Or package-lock.json if you don't have Yarn on your machine
```

_ __sherryfile.js__:

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

- `prompts`: Get the prompts for the reply from the current user.
- `actions`: A series of actions that manipulate files.
- `completed`: A function that will be executed at the end of the entire process.

Then you can run this Generator to generate a new project:

```bash
Sherry ../sherry-sample new-project
```It's worth noting that if `sherry-config.js` is not found in the Generator, Sherry will use a [default configuration](https://github.com/sherryjs/sherry/blob/master/lib/sherryfile. Fallback.js), which simply copies all the files into the target directory.

## Access Generator Context

A [Generator instance](../generator-instance.md) will be created based on the object exported by the Generator. If you want to access this you can use `actions` and `prompts` as instances of the function, you can use `this` to access it:

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

To see all the options supported in `sherry-config.js`, check out [Sherry Generator Config](../generator-config.md).