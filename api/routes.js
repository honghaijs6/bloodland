module.exports = (app) => {
	app.use('/users', require('./containers/users/controllers'));
	app.use('/users/friends', require('./containers/users/controllers/friends'));
	app.use('/users/mails', require('./containers/users/controllers/mails'));
	app.use('/users/trades', require('./containers/users/controllers/trades'));
	app.use('/users/settings', require('./containers/users/controllers/settings'));
	app.use('/lands', require('./containers/lands/controllers'));
	app.use('/notifies', require('./containers/notifies/controllers'));
	app.use('/bitamin', require('./containers/bitamin/controllers'));
}