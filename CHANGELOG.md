<a name="1.1.1"></a>
## [1.1.1](https://github.com/ulivz/sherry/compare/v1.0.0...v1.1.1) (2018-11-19)



<a name="1.0.0"></a>
# 1.0.0 (2018-11-18)


### Bug Fixes

* accept all options in generator.npmInstall ([f81ee43](https://github.com/ulivz/sherry/commit/f81ee43))
* added back --clone option ([#108](https://github.com/ulivz/sherry/issues/108)) ([ac55732](https://github.com/ulivz/sherry/commit/ac55732))
* cache answers by hash + pkg version ([e981a3f](https://github.com/ulivz/sherry/commit/e981a3f))
* clear cached answers when generator is updated ([86b54fc](https://github.com/ulivz/sherry/commit/86b54fc))
* do not store cache by package version ([4e9743e](https://github.com/ulivz/sherry/commit/4e9743e))
* don't show update notifier for generators after being updated ([266bd06](https://github.com/ulivz/sherry/commit/266bd06))
* eliminate alias when it's undefined ([8f8ee68](https://github.com/ulivz/sherry/commit/8f8ee68))
* record used generators ([b1ab201](https://github.com/ulivz/sherry/commit/b1ab201))
* remove updateCheckInterval ([7de5cf5](https://github.com/ulivz/sherry/commit/7de5cf5))
* rename generators option to subGenerators ([8996b0b](https://github.com/ulivz/sherry/commit/8996b0b))
* rename subGenerator.from to subGenerator.generator ([d005ca6](https://github.com/ulivz/sherry/commit/d005ca6))
* should not convert a Promise to boolean ([0d6f4f3](https://github.com/ulivz/sherry/commit/0d6f4f3))
* stop spinner when failed to download repo ([0be4193](https://github.com/ulivz/sherry/commit/0be4193))
* sub generator can only run in existing project ([f94dbdd](https://github.com/ulivz/sherry/commit/f94dbdd))
* use relative pkg path and escape dots ([9a7ede4](https://github.com/ulivz/sherry/commit/9a7ede4))


### Code Refactoring

* rewrite almost everything ([fe8e29b](https://github.com/ulivz/sherry/commit/fe8e29b))


### Features

* **cli:** add update-notifier ([2911dee](https://github.com/ulivz/sherry/commit/2911dee))
* **cli:** allow to set an alias name for a generator, added set-alias get-alias commands. ([4fc26cc](https://github.com/ulivz/sherry/commit/4fc26cc))
* '--generators' option ([d94ef42](https://github.com/ulivz/sherry/commit/d94ef42))
* '--registry' option ([#109](https://github.com/ulivz/sherry/issues/109)) ([e944eb6](https://github.com/ulivz/sherry/commit/e944eb6))
* SAO_CONFIG_FILE env ([8725a46](https://github.com/ulivz/sherry/commit/8725a46))
* SAO_GLOBAL_SCOPE & SAO_MODULE_PREFIX env ([78e32c2](https://github.com/ulivz/sherry/commit/78e32c2))


### BREAKING CHANGES

* see website



