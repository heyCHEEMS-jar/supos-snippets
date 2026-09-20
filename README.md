# SupOS Snippets

supOS 可编程组件 `scriptUtil` / `$os` API 的代码片段、补全提示与悬浮文档。

## 安装

在 VS Code 扩展面板搜索 `SupOS Snippets` 安装。

## 使用

打开工作区后会自动生成 `supos.d.ts`，之后在 JS/TS 里输入 API 即可看到补全和文档。

如果没生成，运行命令 `SupOS Snippets: 生成类型声明 (supos.d.ts)`；改了设置后运行 `SupOS Snippets: 重启扩展`。

## 设置

| 设置        | 说明                                                            |
| ----------- | --------------------------------------------------------------- |
| `Types Dir` | `supos.d.ts` 的存放目录，相对于工作区文件夹，默认留空表示根目录 |
