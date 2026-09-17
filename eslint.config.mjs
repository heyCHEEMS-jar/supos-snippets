import typescriptEslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.ts']
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin
    },

    languageOptions: {
      parser: typescriptEslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },

    rules: {
      // 导入驼峰命名
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase']
        }
      ],
      eqeqeq: 'warn', // 警告非严格相等
      'no-throw-literal': 'warn' // 警告抛出字面量
    }
  }
]
