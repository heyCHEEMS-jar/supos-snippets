import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "supOS-vscode" is now active!')
  const disposable = vscode.commands.registerCommand('supOS-vscode.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from supOS-vscode!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
