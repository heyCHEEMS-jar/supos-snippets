import * as vscode from 'vscode'

// supos.d.ts 类型文件写入工作区
async function generateTypes(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder) {
  const from = vscode.Uri.joinPath(ctx.extensionUri, 'types', 'src')
  const to = vscode.Uri.joinPath(folder.uri, 'supos.d.ts')
  try {
    await vscode.workspace.fs.writeFile(to, await vscode.workspace.fs.readFile(from))
  } catch {
    vscode.window.showErrorMessage(`扩展里缺少 types/supos.d.ts，打包前请先跑 pnpm gen`)
  }
}

export function activate(ctx: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('supos-snippets.generateTypes', async () => {
    const folders = vscode.workspace.workspaceFolders ?? []
    if (!folders.length) {
      vscode.window.showWarningMessage('请先打开一个文件夹')
      return
    }
    for (const folder of folders) await generateTypes(ctx, folder)
    vscode.window.showInformationMessage('已生成 supos.d.ts')
  })
  ctx.subscriptions.push(disposable)
}

export function deactivate() {}
