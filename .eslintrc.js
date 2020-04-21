module.exports = {
  "plugins": [
    "import",
    "react",
    "jsx-a11y",
    "react-hooks",
    "@typescript-eslint"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true,
    "mocha": true
  },
  "extends": [
    "airbnb-typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "rules": {
    "max-len": 0,
    "no-restricted-globals": 0,
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", ".jsx", ".tsx"]
      }
    ],
    "react/destructuring-assignment": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/no-array-index-key": 0,
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "import/prefer-default-export": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
