module.exports = {
    "env": {
        "node": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error", 
            "tab",
            {"SwitchCase": 1}
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        // Stuff I have added.
        "no-unused-vars": [ 0, { "args": "none" } ],
        "no-undef": 0,
        "no-console": 0
    }
};