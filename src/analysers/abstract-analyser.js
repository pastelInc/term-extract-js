'use strict'

class AbstractAnalyser {

  constructor(sentence = '') {
    if (typeof sentence !== 'string') {
      throw new TypeError(`must be an instance of String`)
    }
    this.sentence = sentence
    this.cmpNounFreq = new Map()
    this.parseData()
  }

  // will implemente as abstract function
  parseData() { }

  extract() {
    return this.cmpNounFreq
  }
}

export default AbstractAnalyser
