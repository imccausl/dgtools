import eslintConfig from '@imccausl/dev/eslint-config'

export default [
  {
    ignores: ['**/lib/**', '**/node_modules/**'],
  },
  ...eslintConfig,
]
