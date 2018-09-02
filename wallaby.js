
module.exports = function (wallaby) {
    return {
        files: [
            'packages/reactotron-server/src/**/*.ts',
            '!packages/reactotron-server/src/**/*.test.ts'
        ],
        tests: [
            'packages/reactotron-server/src/**/*.test.ts'
        ],
        env: {
            type: 'node',
            runner: 'node'
        },
        testFramework: 'ava'
    }
}
