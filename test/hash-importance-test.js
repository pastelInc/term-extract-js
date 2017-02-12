import test from 'ava'
import { HashImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashImportance()
})

test('should be sorted by nouns impotance desc', t => {
  const nImp = new Map([
    ['水瀬伊織', 1.2],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1.8],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.7]
  ])
  const expected = [
    ['アイドルマスター', 1.8],
    ['765プロダクション所属アイドル候補生', 1.7],
    ['水瀬伊織', 1.2],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['の登場人物', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.nounsImpDesc(nImp)), expected)
})

test('modify extract word list to readable', t => {
  const expected = '765プロダクション所属アイドル候補生'

  t.is(t.context.imp.agglutinativeLang('765プロダクション 所属 アイドル 候補生'), expected)
})

test('calicurate importance of word by temporary hash', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1.681792830507429]
  ]

  t.deepEqual(Array.from(t.context.imp.nounImportance(sentence)), expected)
})

test('should statistically know how much each single noun is associated with other simple nouns', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['765プロダクション', [1, 0]],
    ['所属', [1, 1]],
    ['アイドル', [1, 1]],
    ['候補生', [0, 1]]
  ]

  t.deepEqual(Array.from(t.context.imp.contiguousStatistics(sentence)), expected)
})

test('return sorted list by importance', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['765プロダクション所属アイドル候補生', 1.681792830507429],
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.importance(sentence)), expected)
})
