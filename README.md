[![npm version](https://badge.fury.io/js/term-extract-js.svg)](https://badge.fury.io/js/term-extract-js)
[![CircleCI](https://circleci.com/gh/pastelInc/term-extract-js.svg?style=shield&circle-token=0d31a0b28ac66315cef6e495a8e931011cc8f5f0)](https://circleci.com/gh/pastelInc/term-extract-js)

# TermExtractJS

This is a module for retrieving technical terms from text data.
This module is a rewrite of [TermExtract](http://gensen.dl.itc.u-tokyo.ac.jp/termextract.html) for JavaScript.
TermExtract is based on the concept of ["technical term automatic extraction system"](http://www.forest.eis.ynu.ac.jp/Forest/ja/term-extraction.html) created by Professor Hiroshi Nakagawa of Tokyo University and Associate Professor Tatsunori Mori of Yokohama National University.
Please refer to [these papers](http://www.r.dl.itc.u-tokyo.ac.jp/~nakagawa/academic-res/jnlp10-1.pdf), for that principle.

## Dependencies

**MeCab**

For MeCab please visit [this site](http://taku910.github.io/mecab/).

## Example

See `examples/`

```sh
$ node examples/FLR.js
トライグラム,14.696938456699067
単語トライグラム,6.260338320293149
トライグラム統計,2.9129506302439405
クラストライグラム,2.6321480259049848
トライグラム抽出,2.6321480259049848
文字トライグラム,2.6321480259049848
単語トライグラム統計,2.5697965868506505
```

## ContributinJavaScript implementation of TermExtractg

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
