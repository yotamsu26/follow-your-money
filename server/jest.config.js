export default {
  preset: "ts-jest/presets/default-esm", // ESM + TS support
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\./.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  watchman: false,
};
