const test = require('ava')
const analyser = require('./mock-analyser-next')
const { scoreFrequency, scoreTF } = require('../src/term-extract-next')

const option = {
  analyser: analyser
}

const sentences = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム`

test('should return undefined', async t => {
  t.is((await scoreFrequency(option, sentences)).get(''), undefined)
})

test('calculate a frequency of left concatenated simple nouns', async t => {
  t.is((await scoreFrequency(option, sentences)).get('単語 トライグラム'), 2)
})

test('calculate a frequency of right concatenated simple nouns', async t => {
  t.is((await scoreFrequency(option, sentences)).get('トライグラム 統計'), 1)
})

test('should return undefined by tf', async t => {
  t.is((await scoreTF(option, sentences)).get(''), undefined)
})

test('calculate a term frequency of left concatenated simple nouns', async t => {
  t.is((await scoreTF(option, sentences)).get('単語 トライグラム'), 3)
})

test('calculate a term frequency of right concatenated simple nouns', async t => {
  t.is((await scoreTF(option, sentences)).get('トライグラム 統計'), 2)
})
