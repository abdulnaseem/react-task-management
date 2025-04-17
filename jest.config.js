export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/setupTests.js'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@mui/material/(.*)$': '<rootDir>/node_modules/@mui/material/$1',
        '^@mui/icons-material/(.*)$': '<rootDir>/node_modules/@mui/icons-material/$1',
    },
};