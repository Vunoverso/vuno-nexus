// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',              // precisa do jest-environment-jsdom instalado
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'], // roda *.test.ts, *.test.tsx, *.test.js, etc.
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',       // transforma TS e TSX
  },
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/','/tests/'], // ignora só os E2E
}
