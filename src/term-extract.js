// LICENSE : MIT
'use strict'

import { COMPOUND_NOUN_SEPARATOR_REGEX } from './constants'
import Config from './config'

class TermExtract {

  constructor(option = {}) {
    this.config = new Config(option)
  }

  /**
   * @return Array
   */
  calculateFrequency(str) {
    const frequency = this.config.getFrequency(str)
    const nouns = frequency.count()

    return this.nounsImpDesc(nouns)
  }

  /**
   * @return Array
   */
  calculateFLR(str) {
    const frequency = this.config.getFrequency(str)
    const scorer = this.config.getScorer(str)
    const imp = new Map()
    const cmpNounFreq = frequency.count()

    for (let [cmpNoun, importance] of cmpNounFreq) {
      let score = scorer.find(cmpNoun)

      if (scorer.constructor.name === 'PerplexityScorer') {
        score += Math.log(importance + 1)
        imp.set(cmpNoun, score / Math.log(2))
      } else {
        imp.set(cmpNoun, importance * score)
      }
    }
    return this.nounsImpDesc(imp)
  }

  /**
   * @return Array
   */
  nounsImpDesc(nImp) {
    if (nImp.constructor.name !== 'Map') {
      throw new TypeError(`Must be an instance of Map`)
    }

    const iterable = [...nImp].map(line => {
      return [this.agglutinativeLang(line[0]), line[1]]
    }).sort((a, b) => {
      return -(a[1] - b[1])
    })

    return iterable
  }

  /**
   * @return String
   */
  agglutinativeLang(data) {
    if (typeof data !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    let disp = ''
    let ascii = false
    let asciiPre = false

    for (let noun of data.split(COMPOUND_NOUN_SEPARATOR_REGEX)) {
      ascii = (noun.match(/^[\x21-\x7E]+$/)) ? true : false
      disp = (ascii && asciiPre) ? `${disp} ${noun}` : `${disp}${noun}`
      asciiPre = ascii
    }
    return disp
  }
}

module.exports = TermExtract
