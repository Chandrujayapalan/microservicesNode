const initializeRoutes = (app) => {
    app.use('/v1/user', require('./v1/user.routes'));


};

module.exports = initializeRoutes