# 测试 Generator

你可以使用任何你想用的测试框架来测试你的 Generator，比如我们将在后文中展示的 [AVA](https://ava.li)

在写真正的测试之前，你需要在你的 Generator 中将 `sherry` 以及你所使用的测试框架作为 dev dependencies 安装：

```bash
cd my-generator
yarn add sherry ava --dev
```

现在，你可以创建一个 `test/test.js` 文件，并包含下述内容：

```js
const test = require('ava')
const sao = require('sao')

const generator = path.join(__dirname)

test('defaults', async t => {
  // 在单元测试中，我们跳过了 prompts 转而使用 mock 的 answers
  // 如果没有提供 mock 的值，那么 Sherry 将会读取 prompt 的默认值
	const mockPromptAnswers = { useRouter: true }
	const stream = await sao.mock({ generator }, mockPromptAnswers)
	// 检查 `router.js` 是在在生成的文件中
	t.true(stream.fileList.includes('router.js'))
})
```

最后，使用 `yarn ava` 来运行这个测试。

## `sherry.mock(input, answers?)`

### input

#### input.generator

- 类型: `string`

指向 Generator 的路径。

### answers

- 类型: `Object`

mock 的 prompt 的 answers。

## `stream`

### stream.fileList

- 类型: `string[]`

生成的文件的列表。

### stream.readFile(filepath)

- 类型: `(path: string) => Promise<string>`

返回输出目录中指定文件的内容。
