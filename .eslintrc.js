module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "typedefs": false }]
    }
};
