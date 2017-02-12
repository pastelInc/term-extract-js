import test from 'ava'
import { HashFrqImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashFrqImportance()
})

test('should be sorted by nouns importance desc', t => {
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

test('calicurate importance of word by temporary hash on frequency', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.nounImportance(sentence)), expected)
})

test('return sorted list by importance', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション所属アイドル候補生', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.importance(sentence)), expected)
})
