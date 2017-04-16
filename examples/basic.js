'use strict'

const TermExtract = require('../lib/term-extract.js')

const str = `トライグラム 統計、トライグラム、単語 トライグラム、クラス トライグラム、単語 トライグラム、トライグラム、トライグラム 抽出、単語 トライグラム 統計、トライグラム、文字 トライグラム。`

const te = new TermExtract()

console.log(te.calculateFLR(str).join('\n'))
