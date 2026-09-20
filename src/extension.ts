import * as vscode from 'vscode'

function targetUri(folder: vscode.WorkspaceFolder) {
  const dir = vscode.workspace.getConfiguration('suposSnippets', folder.uri).get('typesDir', '')
  const to = vscode.Uri.joinPath(folder.uri, ...dir.split(/[\\/]/).filter(Boolean), 'supos.d.ts')
  const base = folder.uri.path.endsWith('/') ? folder.uri.path : folder.uri.path + '/'
  if (to.path.startsWith(base)) return to
  vscode.window.showWarningMessage(`suposSnippets.typesDir 无效（${dir}），已改用工作区根目录`)
  return vscode.Uri.joinPath(folder.uri, 'supos.d.ts')
}

// supos.d.ts 类型文件写入工作区
async function generateTypes(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder) {
  const from = vscode.Uri.joinPath(ctx.extensionUri, 'types', 'supos.d.ts')
  const to = targetUri(folder)
  try {
    await vscode.workspace.fs.writeFile(to, await vscode.workspace.fs.readFile(from))
  } catch {
    vscode.window.showErrorMessage(`写入 ${to.fsPath} 失败：请检查 suposSnippets.typesPath 配置，并确认已执行 pnpm gen`)
  }
}

export async function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    // 生成.d.ts
    vscode.commands.registerCommand('supos-snippets.generateTypes', async () => {
      const folders = vscode.workspace.workspaceFolders ?? []
      if (!folders.length) {
        vscode.window.showWarningMessage('请先打开一个文件夹')
        return
      }
      for (const folder of folders) await generateTypes(ctx, folder)
      vscode.window.showInformationMessage('已生成 supos.d.ts')
    })
  )
  ctx.subscriptions.push(
    // 重启扩展
    vscode.commands.registerCommand('supos-snippets.restart', async () => {
      const folders = vscode.workspace.workspaceFolders ?? []
      if (!folders.length) {
        vscode.window.showWarningMessage('请先打开一个文件夹')
        return
      }
      for (const folder of folders) await generateTypes(ctx, folder)
      await vscode.commands.executeCommand('typescript.restartTsServer')
      vscode.window.showInformationMessage('已重新生成 supos.d.ts 并重启服务')
    })
  )
  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    try {
      await vscode.workspace.fs.stat(targetUri(folder))
    } catch {
      await generateTypes(ctx, folder)
    }
  }
}

export function deactivate() {}

