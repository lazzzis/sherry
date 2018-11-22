# Sharing Generators

To share your generator with others, you can push your the generator directory to GitHub or to any Git provider that is supported by SAO. It's recommended to create a Recipient following the `sao-*` naming convention.

However, it's recommeneded to publish your generator on npm too.

_ __package.json__:

```json
{
  "name": "sao-foo",
  "files": [
    "saofile.js",
    "template"
  ],
  "keywords": [
    "sao-generator",
    "sao",
    "scaffolding"
  ]
}
```