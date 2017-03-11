'use strict'

import { MAX_CMP_SIZE, COMPOUND_NOUN_SEPARATOR_REGEX } from '../constants'
import AbstractScorer from './abstract-scorer'

class FrequencyScorer extends AbstractScorer {

  constructor(analyser) {
    super(analyser)
    this.statistics()
  }

  statistics() {
    this.stat = new Map()

    const cmpNounFreq = this.analyser.extract()

    for (let [cmpNoun, frequency] of cmpNounFreq) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(COMPOUND_NOUN_SEPARATOR_REGEX).filter((noun) => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let noun of nouns) {
        if (this.stat.has(noun)) continue
        this.stat.set(noun, [0, 0])
      }

      for (let i = 0; i < nouns.length - 1; i++) {
        this.stat.get(nouns[i])[0] += frequency
        this.stat.get(nouns[i + 1])[1] += frequency
      }
    }
  }

  find(noun) {
    if (typeof noun !== 'string') {
      throw new TypeError(`must be an instance of String`)
    }

    if (noun.match(/^\s*$/)) return 1
    if (noun.length > MAX_CMP_SIZE) return 1

    let imp = 1
    let count = 0

    for (let n of noun.split(COMPOUND_NOUN_SEPARATOR_REGEX)) {
      if (this.ignoreWords.includes(n)) continue
      if (n.match(/^[\d\.\,]+$/)) continue

      const pre = (this.stat.has(n)) ? this.stat.get(n)[0] : 0
      const post = (this.stat.has(n)) ? this.stat.get(n)[1] : 0

      imp *= (pre + 1) * (post + 1)
      count++
    }

    if (count === 0) count = 1

    return Math.pow(imp, (1 / (2 * this.averageRate * count)))
  }
}

export default FrequencyScorer
