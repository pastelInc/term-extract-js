import MeCabFrequency from './noun-frequency'
import Enum from './enum'

const MAX_CMP_SIZE = 1024
// Compound word weight
const WEIGHT = Enum('NONE', 'TOTAL', 'UNIQUE', 'PERPLEXITY')
// How to calculate importance
const CALC_IMPORTANCE = Enum('NONE', 'FREQUENCY', 'TERM_FREQUENCY')

export class CalcImpotance {
  constructor() {
    this.averageRate = 1
    this.frequency = this.getNounFrequency()
    this.ignoreWords = []
    this.weight = WEIGHT.TOTAL
    this.calcImp = CALC_IMPORTANCE.FREQUENCY
  }

  /**
   * @return Map
   */
  impotance(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const nImp = this.nounImpotance(sentence)

    return this.nounsImpDesc(nImp)
  }

  /**
   * @return MeCabFrequency
   */
  getNounFrequency() {
    return new MeCabFrequency()
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

  /**
   * @return Map
   */
  nounImpotance(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    return this.frequency.nounFrequency(sentence)
  }
}

export class HashImpotance extends CalcImpotance {
  constructor() {
    super()
  }

  contiguousStatistics(sentence) {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounFrq = this.frequency.nounFrequency(sentence)
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

        if (this.weight === WEIGHT.TOTAL) {
          stat.set(nouns[i], [stat.get(nouns[i])[0] + frequency, stat.get(nouns[i])[1]])
          stat.set(nouns[i + 1], [stat.get(nouns[i + 1])[0], stat.get(nouns[i + 1])[1] + frequency])
        }
        else if (this.weight === WEIGHT.UNIQUE && firstComb) {
          stat.set(nouns[i], [stat.get(nouns[i])[0] + 1, stat.get(nouns[i])[1]])
          stat.set(nouns[i + 1], [stat.get(nouns[i + 1])[0], stat.get(nouns[i + 1])[1] + 1])
        }
      }
    }
    return stat
  }

  nounFrequency(sentence) {
    let nCont = this.frequency.nounFrequency(sentence)

    if (this.calcImp === CALC_IMPORTANCE.TERM_FREQUENCY) {
      const hashTFImpotance = new HashTFImpotance()

      nCont = hashTFImpotance.nounImpotance(sentence)
    }
    return nCont
  }

  nounImpotance(sentence) {
    const cmpNounFrq = this.nounFrequency(sentence)
    const stat = this.contiguousStatistics(sentence)
    const nImp = new Map()
    let imp = 1
    let count = 0

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue
      for (let noun of cmpNoun.split(/\s+/)) {
        if (this.ignoreWords.includes(noun)) {
          continue
        }
        if (noun.match(/^[\d\.\,]+$/)) {
          continue
        }

        const pre = (stat.has(noun)) ? stat.get(noun)[0] : 0
        const post = (stat.has(noun)) ? stat.get(noun)[1] : 0

        imp *= (pre + 1) * (post + 1)
        count++
      }
      if (count === 0) count = 1
      imp = Math.pow(imp, (1 / (2 * this.averageRate * count)))
      if (this.calcImp !== CALC_IMPORTANCE.NONE) {
        imp *= cmpNounFrq.get(cmpNoun)
      }
      nImp.set(cmpNoun, imp)
      imp = 1
      count = 0
    }
    return nImp
  }
}

export class HashPerplexityImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}

export class HashFrqImpotance extends CalcImpotance {
  constructor() {
    super()
  }

  nounFrequency(sentence) {
    const nounFrequency = this.frequency.nounFrequency(sentence)
    const nImp = new Map()

    for (let [cmpNoun, frequency] of nounFrequency) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue
      nImp.set(cmpNoun, frequency)
    }
    return nImp
  }
}

export class HashTFImpotance extends CalcImpotance {
  constructor() {
    super()
  }

  termFrequency(sentence) {
    const termFrqData = new Map()
    const cmpNounFrq = this.frequency.nounFrequency(sentence)

    for (let cmpNoun of cmpNounFrq.keys()) {
      if (cmpNoun.match(/^\s*$/)) continue
      if (cmpNoun.length > MAX_CMP_SIZE) continue

      const nouns = cmpNoun.split(/\s+/)

      if (! termFrqData.has(nouns.length)) {
        termFrqData.set(nouns.length, [])
      }
      termFrqData.get(nouns.length).push(cmpNoun)
    }
    return termFrqData
  }

  nounImpotance(sentence) {
    const termFrqData = this.termFrequency(sentence)
    const nImp = this.frequency.nounFrequency(sentence)
    const maxNumOfSimpleNouns = Math.max.apply(null, [...termFrqData.keys()])

    for (let i = 2; i <= maxNumOfSimpleNouns; i++) {
      if (! termFrqData.has(i - 1)) continue
      for (let noun1 of termFrqData.get(i - 1)) {
        const nouns1 = noun1.split(/\s+/)

        for (let j = i; j <= maxNumOfSimpleNouns; j++) {
          if (! termFrqData.has(j)) continue
          for (let noun2 of termFrqData.get(j)) {
            const nouns2 = noun2.split(/\s+/)

            loop:
            for (let x = 0; x < nouns2.length; x++) {
              if (nouns2[x] !== nouns1[0]) continue
              if (i === 2) {
                nImp.set(noun1, nImp.get(noun1) + nImp.get(noun2))
                continue
              }
              for (let y = 1; y < nouns1.length; y++) {
                if ((x + y) > nouns2.length - 1) continue loop
                if (y > nouns1.length - 1) continue loop
                if (nouns2[x + y] !== nouns1[y]) continue loop
              }
              nImp.set(noun1, nImp.get(noun1) + nImp.get(noun2))
            }
          }
        }
      }
    }
    return nImp
  }
}
