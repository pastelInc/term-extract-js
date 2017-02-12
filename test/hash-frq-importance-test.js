import test from 'ava'
import { HashFrqImportance } from '../src/importance'

test.beforeEach(t => {
  t.context.imp = new HashFrqImportance()
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
