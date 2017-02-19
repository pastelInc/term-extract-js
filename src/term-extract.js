'use strict'

import { AbstractLeftRightScore } from './left-right-score'
import { AbstractFrequencyScore } from './frequency-score'

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
   * @return Map
   */
  calculateFrequency(sentence = '') {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }
    if (sentence === '') {
      return new Map()
    }

    const imp = new Map()
    const cmpNounFrq = this.frequency.cmpNounFrq(sentence)

    for (let cmpNoun of cmpNounFrq.keys()) {
      const frequencyScore = this.frequency.frequency(cmpNoun, sentence)

      imp.set(cmpNoun, frequencyScore)
    }
    return this.nounsImpDesc(imp)
  }

  /**
   * @return Map
   */
  calculateFLR(sentence = '') {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }
    if (sentence === '') {
      return new Map()
    }

    const imp = new Map()
    const cmpNounFrq = this.frequency.cmpNounFrq(sentence)

    for (let cmpNoun of cmpNounFrq.keys()) {
      let leftRightScore = this.lr.frequency(cmpNoun, sentence)
      const frequencyScore = this.frequency.frequency(cmpNoun, sentence)

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
   * @return Map
   */
  nounsImpDesc(nImp) {
    if (nImp.constructor.name !== 'Map') {
      throw new TypeError(`Must be an instance of Map`)
    }

    const nImpDesc = new Map([...nImp].sort((a, b) => {
      return -(a[1] - b[1])
    }).map(line => {
      return [this.agglutinativeLang(line[0]), line[1]]
    }))

    return nImpDesc
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

    for (let noun of data.split(/\s+/)) {
      ascii = (noun.match(/^[\x21-\x7E]+$/)) ? true : false
      disp = (ascii && asciiPre) ? `${disp} ${noun}` : `${disp}${noun}`
      asciiPre = ascii
    }
    return disp
  }
}

export default TermExtract
