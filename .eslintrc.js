module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint-config-alloy/react', 'eslint-config-alloy/typescript'],
  plugins: ['react-hooks', 'jest'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 1,
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
      },
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    indent: 'off',
    'max-nested-callbacks': ['error', 5],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': ['error', 2],
    'no-undefined': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '16.8.0',
    },
  },
  env: {
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
};
