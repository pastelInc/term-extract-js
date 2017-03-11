'use strict'

const TermExtract = require('../lib/main.js')

const str = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム。`

console.log(TermExtract.orderedByFreqLRMethodUsingFreq(str).join('\n'))
