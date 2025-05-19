import { cleanAndParseJSON } from './cleanAndParseJSON'

describe('cleanAndParseJSON', () => {
  it('extrai único objeto simples', () => {
    const input = `{ "path":"a.txt","content":"hello" }`
    const out = cleanAndParseJSON(input)
    expect(out).toEqual([{ path: 'a.txt', content: 'hello' }])
  })

  it('ignora texto e extrai múltiplos JSONs', () => {
    const input = `
      foo { "path":"p1","content":"c1" } bar
      { "path":"p2","content":"c2" }
    `
    const out = cleanAndParseJSON(input)
    expect(out.map(f => f.path)).toEqual(['p1','p2'])
    expect(out.map(f => f.content)).toEqual(['c1','c2'])
  })

  it('remove blocos Markdown', () => {
    const input = `
      \`\`\`json
      { "path":"md.ts","content":"// code" }
      \`\`\`
    `
    const out = cleanAndParseJSON(input)
    expect(out[0].path).toBe('md.ts')
  })

  it('retorna array vazio se não houver JSON válido', () => {
    expect(cleanAndParseJSON('sem json aqui')).toEqual([])
  })
})