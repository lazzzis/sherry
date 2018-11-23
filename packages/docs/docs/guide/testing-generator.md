# Testing Generator

You can test your generator using any test framework you want to use, such as [AVA](https://ava.li) which we will show later.

Before writing the real test, you need to install `sherry` and the test framework you are using as dev dependencies in your generator:

```bash
Cd my-generator
Yarn add sherry ava --dev
```

Now you can create a `test/test.js` file with the following content:

```js
const test = require('ava')
const sherry = require('sherry')

const generator = path.join(__dirname)

test('defaults', async t => {
  // 在单元测试中，我们跳过了 prompts 转而使用 mock 的 answers
  // 如果没有提供 mock 的值，那么 Sherry 将会读取 prompt 的默认值
	const mockPromptAnswers = { useRouter: true }
	const stream = await sherry.mock({ generator }, mockPromptAnswers)
	// 检查 `router.js` 是在在生成的文件中
	t.true(stream.fileList.includes('router.js'))
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
