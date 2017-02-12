import MeCab from 'mecab-async'

// use Docker
MeCab.command = 'docker run -i -a STDIN -a STDOUT --rm tsutomu7/mecab'

const meCab = new MeCab()

class MeCabFrequency {
  constructor() {
    this.agglutinativeLang = true
  }

  nounFrequency(sentence) {
    const lines = this.parse(sentence)
    let cmpNounList = new Map()
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
        if (must || ! terms[0]) {
          terms = []
          must = false
          continue
        }
        if (terms.length > 1 && terms[0] === '本') {
          terms.shift()
        }
        const end = terms[terms.length - 1]

        if (end === 'など' || end === 'ら' || end === '上'
            || end === '内' || end === '型' || end === '間'
            || end === '中' || end === '毎' || end === '等'
            || end.match(/^\s+$/) || must) {
          terms.pop()
        }
        const key = terms.join(' ')

        if (cmpNounList.has(key)) {
          cmpNounList.set(key, cmpNounList.get(key) + 1)
        } else {
          cmpNounList.set(key, 1)
        }
        terms = []
      }
      if (must) {
        terms = []
      }
      must = false
    }
    return cmpNounList
  }

  parse(sentence) {
    return meCab.parseSync(sentence)
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

  compoundNoun(terms, cmpNounList, must) {
    if (! terms[0]) {
      return
    }
    if (terms.length > 1 && terms[0] === '本') {
      terms.shift()
    }
    const end = terms[terms.length - 1]

    if (end === 'など' || end === 'ら' || end === '上'
        || end === '内' || end === '型' || end === '間'
        || end === '中' || end === '毎' || end === '等'
        || end.match(/^\s+$/) || must) {
      terms.pop()
    }
    const cmpNoun = terms.join(' ')

    cmpNounList[cmpNoun]++
    terms = []
  }
}

export default MeCabFrequency
