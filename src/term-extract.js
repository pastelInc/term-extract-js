'use strict'

import { COMPOUND_NOUN_SEPARATOR_REGEX } from './constants'
import AbstractScorer from './scorers/abstract-scorer'
import AbstractFrequency from './frequencies/abstract-frequency'

class TermExtract {

  constructor(frequency, scorer) {
    if (! (frequency instanceof AbstractFrequency)) {
      throw new TypeError(`must be an instance of AbstractFrequency`)
    }
    if (! (scorer instanceof AbstractScorer)) {
      throw new TypeError(`must be an instance of AbstractScorer`)
    }
    this.frequency = frequency
    this.scorer = scorer
  }

  /**
   * @return Array
   */
  calculateFrequency() {
    const nouns = this.frequency.count()

    return this.nounsImpDesc(nouns)
  }

  /**
   * @return Array
   */
  calculateFLR() {
    const imp = new Map()
    const cmpNounFreq = this.frequency.count()

    for (let [cmpNoun, importance] of cmpNounFreq) {
      let score = this.scorer.find(cmpNoun)

      if (this.scorer.constructor.name === 'PerplexityScorer') {
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

export default TermExtract
