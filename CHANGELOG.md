<a name="2.0.0"></a>
# [2.0.0](https://github.com/pastelInc/term-extract-js/compare/1.0.0...2.0.0) (2017-04-16)


### BREAKING CHANGES

- should create instance (e.g. `new TermExtract()`)
- can call api `calculateFrequency()` or `calculateFLR()` as `TermExtract` instance 
- can provide dependency as option

```js
const option = {
  frequency: 'frequency', // or term-frequency
  scorer: 'frequency'     // or type or perplexity
}
const te = new TermExtract(option)
onst str = 'トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム。'

te.calculateFLR(str);
// [
//   ['トライグラム', 14.696938456699067,]
//   ['単語トライグラム', 6.260338320293149],
//   ['トライグラム統計', 2.9129506302439405],
//   ['クラストライグラム', 2.6321480259049848],
//   ['トライグラム抽出', 2.6321480259049848],
//   ['文字トライグラム', 2.6321480259049848],
//   ['単語トライグラム統計', 2.5697965868506505]
// ]
```

- remove `orderedByFrequency()`
- remove `orderedByTF()`
- remove `orderedByTypeLRMethodUsingFreq()`
- remove `orderedByTypeLRMethodUsingTF()`
- remove `orderedByFreqLRMethodUsingFreq()`
- remove `orderedByFreqLRMethodUsingTF()`
- remove `orderedByPerplexityUsingFreq()`
- remove `orderedByPerplexityLRMethodUsingTF()`