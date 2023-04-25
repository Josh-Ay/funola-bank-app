const testRoutes = require('./testingRoutes');
const authRoutes = require('./authenticationRoutes');
const errorController = require('../controllers/errorController');
const userRoutes = require('./userRoutes');

module.exports = (app) => {
    app.use('/test', testRoutes);
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);

    
    app.use(errorController.handle_404_requests);
}