#测试 Generator

You can test your generator using any test framework you want to use, such as [AVA](https://ava.li) which we will show later.

Before writing the real test, you need to install `sherry` and the test framework you are using as dev dependencies in your generator:

```bash
Cd my-generator
Yarn add sherry ava --dev
```

Now you can create a `test/test.js` file with the following content:

```js
Const test = require('ava')
Const sao = require('sao')

Const generator = path.join(__dirname)

Test('defaults', async t => {
  // In unit tests, we skipped the prompts and turned to the mock
  // If no mock value is provided, Sherry will read the default value of prompt
Const mockPromptAnswers = { useRouter: true }
Const stream = await sao.mock({ generator }, mockPromptAnswers)
// Check that `router.js` is in the generated file
T.true(stream.fileList.includes('router.js'))
})
```

Finally, run this test with `yarn ava`.

## `sherry.mock(input, answers?)`

### input

#### input.generator

- Type: `string`

The path to the Generator.

### answers

- Type: `Object`

The answer to the mock prompt.

## `stream`

### stream.fileList

- Type: `string[]`

A list of generated files.

### stream.readFile(filepath)

- Type: `(path: string) => Promise<string>`

Returns the contents of the specified file in the output directory.