import MeCab from 'mecab-async'

export class NounFrequency {
  constructor(sentence = '') {
    if (typeof sentence !== 'string') {
      throw new TypeError(`Must be an instance of String`)
    }
    this.sentence = sentence
  }

  // implemented as abstract function
  nounFrequency() { }
}

export class MeCabFrequency extends NounFrequency {

  constructor(sentence) {
    super(sentence)
  }

  nounFrequency() {
    const lines = this.parseData()
    let cmpNounFrq = new Map()
    let terms = []
    let must = false

    for (let line of lines) {
      const noun = line[0]
      const partOfSpeech = line[1]
      const cl1 = line[2]
      const cl2 = line[3]

      if (this.isSingleNoun(noun, partOfSpeech, cl1, cl2)) {
        terms.push(noun)
        must = false
        continue
      }
      else if (this.isAdjectivalNoun(partOfSpeech, cl1)) {
        terms.push(noun)
        must = true
        continue
      }
      else if (this.isAdjectivalNounSuffix(partOfSpeech, cl1, cl2)) {
        terms.push(noun)
        must = true
        continue
      }
      else if (this.isVerb(partOfSpeech)) {
        terms = []
      }
      else {
        if (must) continue
        if (terms.length > 1 && terms[0] === '本') {
          terms.shift()
        }
        if (! terms[0]) {
          terms = []
          continue
        }

        const end = terms[terms.length - 1]

        if (end === 'など' || end === 'ら' || end === '上'
            || end === '内' || end === '型' || end === '間'
            || end === '中' || end === '毎' || end === '等'
            || end.match(/^\s+$/) || must) {
          terms.pop()
        }

        const key = terms.join(' ')

        if (cmpNounFrq.has(key)) {
          cmpNounFrq.set(key, cmpNounFrq.get(key) + 1)
        } else {
          cmpNounFrq.set(key, 1)
        }
        terms = []
      }
      if (must) {
        terms = []
      }
      must = false
    }
    return cmpNounFrq
  }

  parseData() {
    const meCab = new MeCab()

    return meCab.parseSync(this.sentence)
  }

  isSingleNoun(noun, partOfSpeech, cl1, cl2) {
    return (partOfSpeech === '名詞' && cl1 === '一般')
      || (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === '一般')
      || (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === 'サ変接続')
      || (partOfSpeech === '名詞' && cl1 === '固有名詞')
      || (partOfSpeech === '記号' && cl1 === 'アルファベット')
      || (partOfSpeech === '名詞' && cl1 === 'サ変接続' && ! (noun.match(/^[\x21-\x2F]|[{|}:\;\<\>\[\]]$/)))
  }

  isAdjectivalNoun(partOfSpeech, cl1) {
    return (partOfSpeech === '名詞' && cl1 === '形容動詞語幹')
      || (partOfSpeech === '名詞' && cl1 === 'ナイ形容詞語幹')
  }

  isAdjectivalNounSuffix(partOfSpeech, cl1, cl2) {
    return (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === '形容動詞語幹')
  }

  isVerb(partOfSpeech) {
    return (partOfSpeech === '動詞')
  }
}
