'use strict'

import AbstractAnalyser from '../analysers/abstract-analyser'

class AbstractScorer {

  constructor(analyser) {
    if (! (analyser instanceof AbstractAnalyser)) {
      throw new TypeError(`must be an instance of AbstractAnalyser`)
    }
    this.analyser = analyser
    this.ignoreWords = []
    this.averageRate = 1
  }

  // will implemente as abstract function
  find(noun) {
    if (typeof noun !== 'string') {
      throw new TypeError(`must be an instance of String`)
    }
  }
}

export default AbstractScorer
