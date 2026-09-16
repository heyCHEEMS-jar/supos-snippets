import * as vscode from 'vscode'
import * as api from './data/supos-api.json'

const findApi = (name: string) => {
  Object.values(api)
    .flat()
    .find((item) => item.name === name)
}

const OWNERS = ['$os', '$os.api', 'scriptUtil']

const provider: vscode.CompletionItemProvider = {
  provideCompletionItems(
    doc: vscode.TextDocument,
    pos: vscode.Position,
    _token: vscode.CancellationToken,
    _ctx: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const line = doc.lineAt(pos.line).text.slice(0, pos.character)

    // owner 下的 api 补全
    const m = line.match(/(\$os\.api|scriptUtil|\$os)\.(\w*)$/)
    if (m) {
      return [
        ...(m[1] === '$os' ? [new vscode.CompletionItem('api', vscode.CompletionItemKind.Module)] : []),
        ...api[m[1] as keyof typeof api].map((a) => {
          const item = new vscode.CompletionItem(a.name, vscode.CompletionItemKind.Method)
          item.detail = a.brief
          item.documentation = new vscode.MarkdownString('```js\n' + a.example + '\n```')
          return item
        })
      ]
    }
    // owner 自身提示补全
    const w = line.match(/\$?\w+$/)?.[0]
    return OWNERS.filter((t) => w && t.startsWith(w)).map((t) => new vscode.CompletionItem(t, vscode.CompletionItemKind.Variable))
  }
}

export function activate(ctx: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerCompletionItemProvider(
    ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    provider,
    '.'
  )
  // 推入自动清理队列
  ctx.subscriptions.push(disposable)
}

export function deactivate() {}
