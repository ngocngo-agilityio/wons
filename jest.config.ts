import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  clearMocks: true,
  preset: 'ts-jest',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/models/',
    '!<rootDir>/src/types/',
    '!<rootDir>/src/middleware.ts',
    '!<rootDir>/src/contexts/',
  ],
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|svg|jpg)$': 'identity-obj-proxy',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/app/(error|layout|global-error|loading|not-found|robots|sitemap).*',
    '<rootDir>/src/app/api/*',
    '<rootDir>/src/app/\\(dashboard\\)/(error|layout|loading|not-found).*',
    '<rootDir>/src/app/\\(dashboard\\)/.+/(error|layout|loading|not-found).*',
    '<rootDir>/src/app/\\(auth\\)/.+/(error|layout|loading|not-found).*',
    '<rootDir>/src/types/*',
    '<rootDir>/src/models/*',
    '<rootDir>/src/mocks/*',
    '<rootDir>/src/constants/*',
    '<rootDir>/src/contexts/',
    '<rootDir>/src/themes/*',
    '<rootDir>/src/ui/calendar/CalendarClient/index.tsx',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
