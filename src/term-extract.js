import { CalcImportance } from './importance'

class TermExtract {

  constructor(calcImp) {
    if (! (calcImp instanceof CalcImportance)) {
      throw new TypeError(`Must be an instance of CalcImportance`)
    }
    this.calcImp = calcImp
  }

  /**
   * Calicurate LR of word.
   * @return Object
   */
  getImpWord(sentence = '') {
    if (sentence === '') {
      return []
    }
    return this.calcImp.importance(sentence)
  }
}

export default TermExtract
