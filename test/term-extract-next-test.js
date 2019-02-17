const test = require('ava')
const analyser = require('./mock-analyser-next')
const { scoreFrequency, scoreTF, collectStatistics, scoreLR, scoreFLR, scoreTFLR, collectPostStatistics, collectPreStatistics, collectStatPerplexity, scorePerplexity, scoreTFPP } = require('../src/term-extract-next')

const corpus = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム`

test('should return undefined', async t => {
  t.is((await scoreFrequency(corpus, analyser)).get(''), undefined)
})

test('calculate a frequency of left concatenated simple nouns', async t => {
  t.is((await scoreFrequency(corpus, analyser)).get('単語 トライグラム'), 2)
})

test('calculate a frequency of right concatenated simple nouns', async t => {
  t.is((await scoreFrequency(corpus, analyser)).get('トライグラム 統計'), 1)
})

test('should return undefined by tf', async t => {
  t.is((await scoreTF(corpus, analyser)).get(''), undefined)
})

test('calculate a term frequency of left concatenated simple nouns', async t => {
  t.is((await scoreTF(corpus, analyser)).get('単語 トライグラム'), 3)
})

test('calculate a term frequency of right concatenated simple nouns', async t => {
  t.is((await scoreTF(corpus, analyser)).get('トライグラム 統計'), 2)
})

test('should be adding concatenation frequency', async t => {
  const frequency = await scoreFrequency(corpus, analyser)
  const expected = [
    ['トライグラム', [3, 5]],
    ['統計', [0, 2]],
    ['単語', [3, 0]],
    ['クラス', [1, 0]],
    ['抽出', [0, 1]],
    ['文字', [1, 0]]
  ]
  t.deepEqual(Array.from(collectStatistics(frequency, [], false)), expected)
})

test('cannot find a compound noun', async t => {
  const map = await scoreLR(corpus, { analyser })
  t.is(map.get(''), undefined)
})

test('find a compound noun', async t => {
  const map = await scoreLR(corpus, { analyser })
  t.is(map.get('トライグラム'), 4.898979485566356)
  t.is(map.get('トライグラム 統計'), 2.9129506302439405)
  t.is(map.get('単語 トライグラム'), 3.1301691601465746)
})

test('should be adding concatenation taking unique nouns logic', async t => {
  const frequency = await scoreFrequency(corpus, analyser)
  const expected = [
    ['トライグラム', [2, 3]],
    ['統計', [0, 1]],
    ['単語', [1, 0]],
    ['クラス', [1, 0]],
    ['抽出', [0, 1]],
    ['文字', [1, 0]]
  ]
  t.deepEqual(Array.from(collectStatistics(frequency, [], true)), expected)
})

test('cannot find a compound noun taking unique nouns logic', async t => {
  const map = await scoreLR(corpus, { analyser, takeUnique: true })
  t.is(map.get(''), undefined)
})

test('find a compound noun taking unique nouns logic', async t => {
  const map = await scoreLR(corpus, { analyser, takeUnique: true })
  t.is(map.get('トライグラム'), 3.4641016151377544)
  t.is(map.get('トライグラム 統計'), 2.2133638394006434)
  t.is(map.get('単語 トライグラム'), 2.2133638394006434)
})

test('should have calculated FLR', async t => {
  const expected = [
    ['トライグラム', 14.696938456699067],
    ['単語 トライグラム', 6.260338320293149],
    ['トライグラム 統計', 2.9129506302439405],
    ['クラス トライグラム', 2.6321480259049848],
    ['トライグラム 抽出', 2.6321480259049848],
    ['文字 トライグラム', 2.6321480259049848],
    ['単語 トライグラム 統計', 2.5697965868506505]
  ]
  const map = await scoreFLR(corpus, { analyser })

  t.deepEqual(Array.from(map).sort(), expected.sort())
})

test('should have calculated FLR taking unique nouns logic', async t => {
  const expected = [
    ['トライグラム', 10.392304845413264],
    ['単語 トライグラム', 4.426727678801287],
    ['トライグラム 統計', 2.2133638394006434],
    ['クラス トライグラム', 2.2133638394006434],
    ['トライグラム 抽出', 2.2133638394006434],
    ['文字 トライグラム', 2.2133638394006434],
    ['単語 トライグラム 統計', 1.906368585993873]
  ]
  const map = await scoreFLR(corpus, { analyser, takeUnique: true })

  t.deepEqual(Array.from(map).sort(), expected.sort())
})

test('should have calculated TFLR', async t => {
  const expected = [
    ['トライグラム', 48.98979485566356],
    ['単語 トライグラム', 9.390507480439723],
    ['トライグラム 統計', 5.825901260487881],
    ['クラス トライグラム', 2.6321480259049848],
    ['トライグラム 抽出', 2.6321480259049848],
    ['文字 トライグラム', 2.6321480259049848],
    ['単語 トライグラム 統計', 2.5697965868506505]
  ]
  const map = await scoreTFLR(corpus, { analyser })

  t.deepEqual(Array.from(map).sort(), expected.sort())
})

test('should have calculated TFLR taking unique nouns logic', async t => {
  const expected = [
    ['トライグラム', 34.64101615137754],
    ['単語 トライグラム', 6.64009151820193],
    ['トライグラム 統計', 4.426727678801287],
    ['クラス トライグラム', 2.2133638394006434],
    ['トライグラム 抽出', 2.2133638394006434],
    ['文字 トライグラム', 2.2133638394006434],
    ['単語 トライグラム 統計', 1.906368585993873]
  ]
  const map = await scoreTFLR(corpus, { analyser, takeUnique: true })

  t.deepEqual(Array.from(map).sort(), expected.sort())
})

test('should be adding concatenation pre frequency', async t => {
  const expected = new Map([
    ['統計', [
      ['トライグラム', 2]
    ]],
    ['抽出', [
      ['トライグラム', 1]
    ]],
    ['トライグラム', [
      ['単語', 2],
      ['クラス', 1],
      ['文字', 1]
    ]]
  ])
  const frequency = await scoreFrequency(corpus, analyser)
  const map = collectPreStatistics(frequency, [])

  t.deepEqual(Array.from(map.get('統計')), expected.get('統計'))
  t.deepEqual(Array.from(map.get('抽出')), expected.get('抽出'))
  t.deepEqual(Array.from(map.get('トライグラム')), expected.get('トライグラム'))
})

test('should be adding concatenation post frequency', async t => {
  const expected = new Map([
    ['文字', [
      ['トライグラム', 1]
    ]],
    ['トライグラム', [
      ['統計', 2],
      ['抽出', 1]
    ]],
    ['クラス', [
      ['トライグラム', 1]
    ]],
    ['単語', [
      ['トライグラム', 2]
    ]]
  ])
  const frequency = await scoreFrequency(corpus, analyser)
  const map = collectPostStatistics(frequency, [])

  t.deepEqual(Array.from(map.get('文字')), expected.get('文字'))
  t.deepEqual(Array.from(map.get('トライグラム')), expected.get('トライグラム'))
  t.deepEqual(Array.from(map.get('クラス')), expected.get('クラス'))
  t.deepEqual(Array.from(map.get('単語')), expected.get('単語'))
})

test('should have calculated entropy', async t => {
  const expected = [
    ['トライグラム', 1.656604433192],
    ['統計', 0.2703100720721096],
    ['単語', 0.34657359027997264],
    ['クラス', 0.34657359027997264],
    ['抽出', 0.34657359027997264],
    ['文字', 0.34657359027997264]
  ]
  const frequency = await scoreFrequency(corpus, analyser)
  const stat = collectStatistics(frequency, [], false)
  const postStat = collectPostStatistics(frequency, [])
  const preStat = collectPreStatistics(frequency, [])
  const map = collectStatPerplexity(stat, postStat, preStat)
  t.deepEqual(Array.from(map), expected)
})

test('cannot find a compound noun using perplexity', async t => {
  const map = await scorePerplexity(corpus, { analyser })

  t.is(map.get(''), undefined)
})

test('find a compound noun using perplexity', async t => {
  const map = await scorePerplexity(corpus, { analyser })

  t.is(map.get('トライグラム'), 0.828302216596)
  t.is(map.get('文字 トライグラム'), 0.5007945058679931)
})

test('should have calculated perplexity of frequency and term frequency', async t => {
  const expected = [
    ['トライグラム', 4.654419118877683],
    ['単語 トライグラム', 2.7224937501201922],
    ['トライグラム 統計', 2.2799500009615414],
    ['クラス トライグラム', 1.7224937501201927],
    ['トライグラム 抽出', 1.7224937501201927],
    ['文字 トライグラム', 1.7224937501201927],
    ['単語 トライグラム 統計', 1.5466583334935902]
  ]
  const map = await scoreTFPP(corpus, { analyser })

  t.deepEqual(Array.from(map).sort(), expected.sort())
})
