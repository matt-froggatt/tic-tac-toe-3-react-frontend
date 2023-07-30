module.exports = {
	style: {
		postcssOptions: {
			plugins: [
				require('tailwindcss'),
				require('autoprefixer'),
			],
		},
	},
	resolve: {
		fallback: {
			util: require.resolve("util/")
		}
	}
}