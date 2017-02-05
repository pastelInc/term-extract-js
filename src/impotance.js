import MeCabFrequency from './noun-frequency'

export class CalcImpotance {
  constructor() {
    this.frequency = this.getNounFrequency()
  }

  /**
   * @return Object
   */
  impotance(sentence) {
    if (sentence !== String) {
      throw new TypeError(`Must be an instance of String`)
    }

    const cmpNounList = this.frequency.nounFrequency(sentence)

    return cmpNounList
  }

  /**
   * @return Object
   */
  getNounFrequency() {
    return new MeCabFrequency()
  }
}

export class HashImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}

export class HashPerplexityImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}

export class HashFreqImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}

export class HashTFImpotance extends CalcImpotance {
  constructor() {
    super()
  }
}
