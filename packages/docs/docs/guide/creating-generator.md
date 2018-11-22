# Creating Generator

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
├── sherry-config.js
├── template
│ ├── LICENSE
│ ├── README.md
│ └── gitignore
├── test
│ └── test.js
└── yarn.lock # Or package-lock.json if you don't have Yarn on your machine
```

📝 __sherry-config.js__:

```js
const superb = require('superb')

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true
      }
    ]
  },
  actions: [
    {
      type: 'add',
      // Copy and transform all files in `template` folder into output directory
      files: '**'
    },
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore'
      }
    }
  ],
  async completed() {
    this.gitInit()
    await this.npmInstall()
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
module.exports = {
  prompts() {
    return [
      {
        name: 'author',
        message: 'What is your name',
        // Use the value of `git config --global user.name` as the default value
        default: this.gitUser.name
      }
    ]
  },
  // ...
}
```

To see all the options supported in `sherry-config.js`, check out [Sherry Generator Config](../generator-config.md).
