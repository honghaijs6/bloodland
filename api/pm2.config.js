module.exports = {
	apps : [
		{
			name: "api",
			script: "app.js",
			watch: true,
			env: {
				"PORT": 5001,
				"NODE_ENV": "development"
			},
			env_staging: {
				"PORT": 3001,
				"NODE_ENV": "staging",
			},
			env_production: {
				"PORT": 4000,
				"NODE_ENV": "production",
			}
		},
	]
}