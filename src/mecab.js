const MeCabAsync = require('mecab-async')
// const { COMPOUND_NOUN_SEPARATOR } = require('../constants')

function getCompNounList (data) {
  const compNounList = []
  const lines = data
  let terms = []
  let must = false

  for (let line of lines) {
    const noun = line[0]
    const partOfSpeech = line[1]
    const cl1 = line[2]
    const cl2 = line[3]

    if (isSingleNoun(noun, partOfSpeech, cl1, cl2)) {
      terms.push(noun)
      must = false
      continue
    } else if (isAdjectivalNoun(partOfSpeech, cl1)) {
      terms.push(noun)
      must = true
      continue
    } else if (isAdjectivalNounSuffix(partOfSpeech, cl1, cl2)) {
      terms.push(noun)
      must = true
      continue
    } else if (isVerb(partOfSpeech)) {
      terms = []
      must = false
      continue
    } else {
      if (must) continue
      if (terms.length > 1 && terms[0] === '本') {
        terms.shift()
      }
      if (!terms[0]) {
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

      const compNoun = terms.join(' ')

      compNounList.push(compNoun)
      terms = []
      must = false
    }
  }
  return compNounList
}

function isSingleNoun (noun, partOfSpeech, cl1, cl2) {
  return (partOfSpeech === '名詞' && cl1 === '一般')
    || (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === '一般')
    || (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === 'サ変接続')
    || (partOfSpeech === '名詞' && cl1 === '固有名詞')
    || (partOfSpeech === '記号' && cl1 === 'アルファベット')
    || (partOfSpeech === '名詞' && cl1 === 'サ変接続' && ! (noun.match(/^[\x21-\x2F]|[{|}:\;\<\>\[\]]$/)))
}

function isAdjectivalNoun (partOfSpeech, cl1) {
  return (partOfSpeech === '名詞' && cl1 === '形容動詞語幹')
    || (partOfSpeech === '名詞' && cl1 === 'ナイ形容詞語幹')
}

function isAdjectivalNounSuffix (partOfSpeech, cl1, cl2) {
  return (partOfSpeech === '名詞' && cl1 === '接尾' && cl2 === '形容動詞語幹')
}

function isVerb (partOfSpeech) {
  return (partOfSpeech === '動詞')
}

function parse (corpus) {
  const mecab = new MeCabAsync()

  return new Promise((resolve, reject) => {
    mecab.parse(corpus, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = async function (corpus) {
  const data = await parse(corpus)
  return getCompNounList(data)
}
