'use strict'

import { NounFrequency, MeCabFrequency } from './noun-frequency'

const MAX_CMP_SIZE = 1024

export class AbstractLeftRightScore {

  constructor(nounFrequency = new MeCabFrequency()) {
    if (! (nounFrequency instanceof NounFrequency)) {
      throw new TypeError(`Must be an instance of NounFrequency`)
    }
    this.nounFrequency = nounFrequency
    this.ignoreWords = []
    this.averageRate = 1
  }

  // abstract function
  frequency(noun, sentence) {
    if (typeof noun !== 'string' || typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }
  }
}

export class FrequencyLeftRightScore extends AbstractLeftRightScore {

  constructor(nounFrequency) {
    super(nounFrequency)
  }

  statistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)
    const stat = new Map()

    for (let [cmpNoun, frequency] of cmpNounFrq) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/).filter(noun => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let noun of nouns) {
        if (stat.has(noun)) continue
        stat.set(noun, [0, 0])
      }
      for (let i = 0; i < nouns.length - 1; i++) {
        stat.get(nouns[i])[0] += frequency
        stat.get(nouns[i + 1])[1] += frequency
      }
    }
    return stat
  }

  frequency(noun, sentence) {
    if (typeof noun !== 'string' || typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    if (noun.match(/^\s*$/)) return 1
    if (noun.length > MAX_CMP_SIZE) return 1

    let imp = 1
    let count = 0
    const stat = this.statistics(sentence)

    for (let n of noun.split(/\s+/)) {
      if (this.ignoreWords.includes(n)) continue
      if (n.match(/^[\d\.\,]+$/)) continue

      const pre = (stat.has(n)) ? stat.get(n)[0] : 0
      const post = (stat.has(n)) ? stat.get(n)[1] : 0

      imp *= (pre + 1) * (post + 1)
      count++
    }

    if (count === 0) count = 1

    return Math.pow(imp, (1 / (2 * this.averageRate * count)))
  }
}

export class TypeLeftRightScore extends AbstractLeftRightScore {

  constructor(nounFrequency) {
    super(nounFrequency)
  }

  statistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)
    const stat = new Map()
    const comb = new Map()

    for (let [cmpNoun, frequency] of cmpNounFrq) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/).filter(noun => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let noun of nouns) {
        if (stat.has(noun)) continue
        stat.set(noun, [0, 0])
      }
      for (let i = 0; i < nouns.length - 1; i++) {
        const combKey = `${nouns[i]} ${nouns[i + 1]}`
        let firstComb = false

        if (comb.has(combKey)) {
          comb.set(combKey, comb.get(combKey) + frequency)
        }
        else {
          firstComb = true
          comb.set(combKey, frequency)
        }
        if (firstComb) {
          stat.get(nouns[i])[0] += 1
          stat.get(nouns[i + 1])[1] += 1
        }
      }
    }
    return stat
  }


  frequency(noun, sentence) {
    if (typeof noun !== 'string' || typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    if (noun.match(/^\s*$/)) return 1
    if (noun.length > MAX_CMP_SIZE) return 1

    const stat = this.statistics(sentence)
    let imp = 1
    let count = 0

    for (let n of noun.split(/\s+/)) {
      if (this.ignoreWords.includes(n)) continue
      if (n.match(/^[\d\.\,]+$/)) continue
      const pre = (stat.has(n)) ? stat.get(n)[0] : 0
      const post = (stat.has(n)) ? stat.get(n)[1] : 0

      imp *= (pre + 1) * (post + 1)
      count++
    }

    if (count === 0) count = 1

    return Math.pow(imp, (1 / (2 * this.averageRate * count)))
  }
}

export class PerplexityLeftRightScore extends AbstractLeftRightScore {

  constructor(nounFrequency) {
    super(nounFrequency)
  }

  statistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)
    const stat = new Map()

    for (let [cmpNoun, frequency] of cmpNounFrq) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/).filter(noun => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let noun of nouns) {
        if (stat.has(noun)) continue
        stat.set(noun, [0, 0])
      }

      for (let i = 0; i < nouns.length - 1; i++) {
        stat.get(nouns[i])[0] += frequency
        stat.get(nouns[i + 1])[1] += frequency
      }
    }
    return stat
  }

  preStatistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)
    const pre = new Map()

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/).filter(noun => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let i = 0; i < nouns.length - 1; i++) {
        if (! pre.has(nouns[i + 1])) {
          pre.set(nouns[i + 1], new Map())
        }
        if (! pre.get(nouns[i + 1]).has(nouns[i])) {
          pre.get(nouns[i + 1]).set(nouns[i], 0)
        }
      }

      for (let i = 0; i < nouns.length - 1; i++) {
        pre.get(nouns[i + 1]).set(nouns[i], pre.get(nouns[i + 1]).get(nouns[i]) + 1)
      }
    }
    return pre
  }

  postStatistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.nounFrequency.nounFrequency(sentence)
    const post = new Map()

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun === '') continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/).filter(noun => {
        return ! (this.ignoreWords.includes(noun)) && ! (noun.match(/^[\d\.\,]+$/))
      })

      if (! (nouns.length > 1)) continue

      // initialize
      for (let i = 0; i < nouns.length - 1; i++) {
        if (! post.has(nouns[i])) {
          post.set(nouns[i], new Map())
        }
        if (! post.get(nouns[i]).has(nouns[i + 1])) {
          post.get(nouns[i]).set(nouns[i + 1], 0)
        }
      }

      for (let i = 0; i < nouns.length - 1; i++) {
        post.get(nouns[i]).set(nouns[i + 1], post.get(nouns[i]).get(nouns[i + 1]) + 1)
      }
    }
    return post
  }

  statPerplexity(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const statPerplexity = new Map()
    const stat = this.statistics(sentence)
    const pre = this.preStatistics(sentence)
    const post = this.postStatistics(sentence)

    for (let cn of stat.keys()) {
      let h = 0

      if (stat.get(cn)[0]) {
        for (let v of post.get(cn).values()) {
          let work = v / (stat.get(cn)[0] + 1)
          h -= work * Math.log(work)
        }
      }
      if (stat.get(cn)[1]) {
        for (let v of pre.get(cn).values()) {
          let work = v / (stat.get(cn)[1] + 1)
          h -= work * Math.log(work)
        }
      }
      statPerplexity.set(cn, h)
    }
    return statPerplexity
  }

  frequency(noun, sentence) {
    if (typeof noun !== 'string' || typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    if (noun.match(/^\s*$/)) return 1
    if (noun.length > MAX_CMP_SIZE) return 1

    let imp = 0
    let count = 0
    const statPerplexity = this.statPerplexity(sentence)

    for (let n of noun.split(/\s+/)) {
      if (this.ignoreWords.includes(n)) continue
      if (n.match(/^[\d\.\,]+$/)) continue
      if (statPerplexity.has(n)) {
        imp += statPerplexity.get(n)
      }
      count++
    }

    if (count === 0) count = 1
    return imp / (2 * this.averageRate * count)
  }
}
