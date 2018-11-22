# Testing Generators

You can test your generators with your testing framework of choice, like [AVA](https://ava.li) we are going to use here.

Before writing actual tests, you need to install `sao` and your testing frameworkin the generator as dev dependencies:

```bash
Cd my-generator
Yarn add sao ava --dev
```

Now populate `test/test.js` with the following contents:

```js
Const test = require('ava')
Const sao = require('sao')

Const generator = path.join(__dirname)

Test('defaults', async t => {
// In unit tests we skip prompts and use mocked answers instead
// If not provided we will use the default value of the prompt
Const mockPromptAnswers = { useRouter: true }
Const stream = await sao.mock({ generator }, mockPromptAnswers)
// Check if `router.js` is in the generated files
T.true(stream.fileList.includes('router.js'))
})
```

Finally type `yarn ava` to run the tests.

## `sao.mock(input, answers?)` references

### input

#### input.generator

- Type: `string`

The path to the generator.

### answers

- Type: `Object`

Mocked prompt answers.

## `stream` references

### stream.fileList

- Type: `string[]`

A list of generated files.

### stream.readFile(filepath)

- Type: `(path: string) => Promise<string>`

Read the contents of specific file in the output directory.