# 分享 Generator

要与其他人共享你的 Generator，你可以将生成器目录推送到 GitHub 或任意的 git 服务提供者。建议按照 `sherry-` de 命名约定来创建一个仓库。

当然，还是推荐你将你的 Generator 发布到 npm：

📝 __package.json__:

```json
{
  "name": "sherry-foo",
  "files": [
    "sherry-config.js",
    "template"
  ],
  "keywords": [
    "sherry-generator",
    "sherry",
    "scaffolding"
  ]
}
```
