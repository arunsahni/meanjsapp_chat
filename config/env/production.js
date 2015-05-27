'use strict';

module.exports = {
	//db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/meanjsapp',
	//db: 'mongodb://localhost/meanjsapp-dev',
	db: 'mongodb://suma:sumapass@ds061671.mongolab.com:61671/meanjsapp-dev', // Our server database
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-toastr/dist/angular-toastr.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/highcharts-release/adapters/standalone-framework.src.js',
				'public/lib/highcharts-release/highcharts.src.js',
				'public/lib/angular-toastr/dist/angular-toastr.js',
				'public/lib/pusher-angular/lib/pusher-angular.js',
				'public/lib/ng-file-upload/angular-file-upload.js',
				'public/lib/angular-translate/angular-translate.js',
				'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/socket.io-client/socket.io.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'sumacrm025@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'sumacrm025@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'sumasoft123'
			}
		}
	}
};
