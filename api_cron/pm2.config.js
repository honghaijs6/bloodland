module.exports = {
	apps : [
		{
			name: "api_cron",
			script: "app.js",
			"node_args": ["--max_old_space_size=16384"],
			//watch: true,
			env: {
				"PORT": 5004,
				"NODE_ENV": "development"
			},
			env_staging: {
				"PORT": 6001,
				"NODE_ENV": "staging",
			},
			env_production: {
				"PORT": 4000,
				"NODE_ENV": "production",
			}
		},
	]
}