// pm2 start/restart pm2.config.js --env staging
// /www/api_game NODE_ENV=staging node dev.js
// fuser -n tcp -k 3001
// sudo nano ./auto.sh
module.exports = {
	apps : [
		{
			name: "api",
			script: "api/app.js",
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
				"PORT": 3001,
				"NODE_ENV": "production",
			}
		},
		{
			name: "api_game",
			script: "api_game/app.js",
			watch: true,
			env: {
				"PORT": 5002,
				"NODE_ENV": "development"
			},
			env_staging: {
				"PORT": 4001,
				"NODE_ENV": "staging",
			},
			env_production: {
				"PORT": 4001,
				"NODE_ENV": "production",
			}
		},
		// {
		// 	name: "cron-api",
		// 	script: "api_cron/app.js",
		// 	watch: true,
		// 	env: {
		// 		"PORT": 5004,
		// 		"NODE_ENV": "development"
		// 	},
		// 	env_staging: {
		// 		"PORT": 6001,
		// 		"NODE_ENV": "staging",
		// 	},
		// 	env_production: {
		// 		"PORT": 80,
		// 		"NODE_ENV": "production",
		// 	}
		// },
	]
}
