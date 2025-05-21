// .eslintrc.js
module.exports = {
  root: true, // para não subir acima desta pasta
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    '@typescript-eslint',  // removido 'react-hooks'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'next/core-web-vitals', // já inclui react-hooks/recommended
  ],
  rules: {
    // permite usar `any` explicitamente
    '@typescript-eslint/no-explicit-any': 'off',

    // warnings para vars não usadas, mas ignora args/vars que começam com '_'
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // desativa aviso de preferir const
    'prefer-const': 'off',

    // permite catch {} vazio
    'no-empty': ['error', { allowEmptyCatch: true }],

    // permite interfaces e funções vazias em TS
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    // desativa acessibilidade de label sem control associado
    'jsx-a11y/label-has-associated-control': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'generated/',
    'coverage/'
  ],
};
