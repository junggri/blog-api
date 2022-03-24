module.exports = {
    "moduleNameMapper": {
        "@src/(.*)$": "<rootDir>/src/$1",
        "@utils/(.*)$": "<rootDir>/utils/$1",
        "@config/(.*)$": "<rootDir>/config/$1",
        "@exception/(.*)$": "<rootDir>/exception/$1",
        "@decorator/(.*)$": "<rootDir>/decorator/$1",
        "^react$": "@apollo/client/core",
    },
    clearMocks: true,
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }

    },
    rootDir: ".",
    setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
    testRegex: ".*\\.e2e-(spec)\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    testEnvironment: "node"
};
