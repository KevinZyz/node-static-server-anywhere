module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		'no-console': [
			'error',
			{ allow: ['warn', 'error', 'info'] }
		],
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'warn',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
