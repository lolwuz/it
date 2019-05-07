module.exports = {
        'env': {
        'browser': true,
        'es6': true
    },
        'extends': 'standard',
        'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
        'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    "rules":{
        "indent": [2, "tab"],
        "no-tabs": 0,
        "camelcase": [2, {"properties": "never"}]
    }
}
