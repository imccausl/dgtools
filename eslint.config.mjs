// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintConfig from '@imccausl/dev/eslint-config'

export default [{
  ignores: ['**/lib/**', '**/node_modules/**'],
}, ...eslintConfig, ...storybook.configs["flat/recommended"]];
