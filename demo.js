'use strict'

const TermExtract = require('./lib/main.js').TermExtract
const LRScore = require('./lib/main.js').FrequencyLeftRightScore
const FrequencyScore = require('./lib/main.js').TermFrequencyScore

const sentences = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム`

const termExtract = new TermExtract(
  new LRScore(),
  new FrequencyScore()
)
const importance = termExtract.calculateFLR(sentences)

process.stdout.write([...importance].join('\n'))
