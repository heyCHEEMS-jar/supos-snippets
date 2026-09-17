/**
 * 将 src/data/supos-api.json 格式化为 snippets/supos.json 代码片段数据
 */
import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('src/data/supos-api.json', 'utf8'))

// 防止运行时把\和$识别为转义字符
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\$/g, '\\$')

const prefixMap = { scriptUtil: 'os-', '$os.api': 'os-api-', $os: 'os-' }

const out = {}
for (const [owner, apis] of Object.entries(data)) {
  for (const a of apis) {
    out[`${owner}.${a.name}`] = {
      prefix: `${prefixMap[owner]}${a.name}`,
      body: esc(a.example).split('\n'),
      description: a.brief
    }
  }
}

fs.mkdirSync('snippets', { recursive: true })
fs.writeFileSync('snippets/supos.jsonc', '// 由 scripts/gen-snippets.mjs 生成，请勿手改！\n\n' + JSON.stringify(out, null, 2) + '\n')
console.log(`generated ${Object.keys(out).length} snippets -> snippets/supos.jsonc`)
