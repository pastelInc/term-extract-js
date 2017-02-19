
# TermExtractJS

This is a module for retrieving technical terms from text data.
This module is a rewrite of [TermExtract](http://gensen.dl.itc.u-tokyo.ac.jp/termextract.html) for JavaScript.
TermExtract is based on the concept of ["technical term automatic extraction system"](http://www.forest.eis.ynu.ac.jp/Forest/ja/term-extraction.html) created by Professor Hiroshi Nakagawa of Tokyo University and Associate Professor Tatsunori Mori of Yokohama National University.
Please refer to [these papers](http://www.r.dl.itc.u-tokyo.ac.jp/~nakagawa/academic-res/jnlp10-1.pdf), for that principle.

## Dependencies

**MeCab**

For MeCab please visit [this site](http://taku910.github.io/mecab/).

## Example

See `demo.js`

```sh
$ node demo.js
トライグラム,40.24922359499622
単語トライグラム,8.972092687327322
トライグラム統計,5.566315367427481
クラストライグラム,2.514866859365871
トライグラム抽出,2.514866859365871
単語トライグラム統計,2.492882871678434
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
