import test from 'ava'
import { HashImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashImportance()
})

test('should be sorted by nouns impotance desc', t => {
  const nImp = new Map([
    ['水瀬伊織', 1.2],
    ['765プロダクション', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1.8],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.7]
  ])
  const expected = [
    ['アイドルマスター', 1.8],
    ['765プロダクション所属アイドル候補生', 1.7],
    ['水瀬伊織', 1.2],
    ['765プロダクション', 1],
    ['ゲーム', 1],
    ['の登場人物', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.nounsImpDesc(nImp)), expected)
})

test('modify extract word list to readable', t => {
  const sentence = '765プロダクション 所属 アイドル 候補生'
  const expected = '765プロダクション所属アイドル候補生'

  t.is(t.context.imp.agglutinativeLang(sentence), expected)
})

test('calicurate importance of word by temporary hash', t => {
  const sentences = `水瀬伊織（みなせ いおり）は、ゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。自分自身の力で掴み取る栄光を求めて765プロダクションに入る。`
  const expected = [
    ['水瀬伊織', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.681792830507429],
    ['自分自身', 1],
    ['力', 1],
    ['栄光', 1],
    ['765プロダクション', 1.4142135623730951]
  ]

  t.deepEqual(Array.from(t.context.imp.nounImportance(sentences)), expected)
})

test('should statistically know how much each single noun is associated with other simple nouns', t => {
  const sentences = `水瀬伊織（みなせ いおり）は、ゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。自分自身の力で掴み取る栄光を求めて765プロダクションに入る。`
  const expected = [
    ['765プロダクション', [1, 0]],
    ['所属', [1, 1]],
    ['アイドル', [1, 1]],
    ['候補生', [0, 1]]
  ]

  t.deepEqual(Array.from(t.context.imp.contiguousStatistics(sentences)), expected)
})

test('return sorted list by importance', t => {
  const sentences = `水瀬伊織（みなせ いおり）は、ゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。自分自身の力で掴み取る栄光を求めて765プロダクションに入る。`
  const expected = [
    ['765プロダクション所属アイドル候補生', 1.681792830507429],
    ['765プロダクション', 1.4142135623730951],
    ['水瀬伊織', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['自分自身', 1],
    ['力', 1],
    ['栄光', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.importance(sentences)), expected)
})
