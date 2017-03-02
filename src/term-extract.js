'use strict'

import { AbstractLeftRightScore } from './left-right-score'
import { AbstractFrequencyScore } from './frequency-score'
import { COMPOUND_NOUN_SEPARATOR_REGEX } from './constants'

class TermExtract {

  constructor(lr, frequency) {
    if (! (lr instanceof AbstractLeftRightScore)) {
      throw new TypeError(`Must be an instance of AbstractLeftRightScore`)
    }
    if (! (frequency instanceof AbstractFrequencyScore)) {
      throw new TypeError(`Must be an instance of AbstractFrequencyScore`)
    }
    this.lr = lr
    this.frequency = frequency
  }

  /**
   * @return Array
   */
  calculateFrequency() {
    const nouns = this.frequency.cmpNouns()

    return this.nounsImpDesc(nouns)
  }

  /**
   * @return Array
   */
  calculateFLR() {
    const imp = new Map()
    const cmpNouns = this.frequency.cmpNouns()

    for (let [cmpNoun, frequencyScore] of cmpNouns) {
      let leftRightScore = this.lr.frequency(cmpNoun)

      if (this.lr.constructor.name === 'PerplexityLeftRightScore') {
        leftRightScore += Math.log(frequencyScore + 1)
        imp.set(cmpNoun, leftRightScore / Math.log(2))
      } else {
        imp.set(cmpNoun, frequencyScore * leftRightScore)
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
