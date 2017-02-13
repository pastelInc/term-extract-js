import test from 'ava'
import { HashTFImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashTFImportance()
})

test('return single-noun number data in compound word', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    [1, ['水瀬伊織','バンダイナムコゲームス','ゲーム','アイドルマスター','の登場人物']],
    [4, ['765プロダクション 所属 アイドル 候補生']]
  ]

  t.deepEqual(Array.from(t.context.imp.termFrqData(sentence)), expected)
})

test('calicurate importance of word by temporary hash on term frequency', t => {
  const sentence = `水瀬伊織（みなせ いおり）は、バンダイナムコゲームスのゲーム『アイドルマスター』の登場人物で、765プロダクション所属アイドル候補生の一人である。`
  const expected = [
    ['水瀬伊織', 1],
    ['バンダイナムコゲームス', 1],
    ['ゲーム', 1],
    ['アイドルマスター', 1],
    ['の登場人物', 1],
    ['765プロダクション 所属 アイドル 候補生', 1]
  ]

  t.deepEqual(Array.from(t.context.imp.nounTermFrequency(sentence)), expected)
})
